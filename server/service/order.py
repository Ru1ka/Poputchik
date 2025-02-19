from fastapi import Depends, status, HTTPException
import requests
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import openrouteservice
from openrouteservice.geocode import pelias_search
from openrouteservice.directions import directions
from openrouteservice.exceptions import ApiError as ORSError
from openrouteservice.exceptions import Timeout, _OverQueryLimit

from log_config import logger as logging
from settings import settings
from database.db_session import get_session
from database.orders import Order
from database.loading_points import LoadingPoint
from database.unloading_points import UnloadingPoint
from database.users import User

class OrderService:
    client = openrouteservice.Client(key=settings().ORS_API_KEY, timeout=4, retry_timeout=3)

    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def _safe_commit(self):
        try:
            self.session.commit()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DB error, invalid data."
            )

    def _add_route_coords(self, route, ignore_ors_errors=False):
        for point in route:
            try:
                request = pelias_search(self.client, text=f'{point["locality"]}, {point["address"]}', country="RU", layers=["address"], size=1)
                if request["features"]:
                    coordinates = request["features"][0]["geometry"]["coordinates"]
                elif ignore_ors_errors:
                    return False
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Одного из адресов не существует."
                    )
                point["coordinates"] = coordinates
            except ORSError as err:
                logging.warning(f'ORS error: {err.message}')
                if not ignore_ors_errors:
                    raise HTTPException(
                        status_code=err.status,
                        detail=err.message
                    )
                return False
            except _OverQueryLimit:
                logging.error("Over query limit")
                
            except Timeout:
                logging.error("ORS timeout.")
                if not ignore_ors_errors:
                    raise HTTPException(
                        status_code=status.HTTP_408_REQUEST_TIMEOUT,
                        detail="ORS timeout."
                    )
                return False
        return True


    def _get_distance(self, route_coords: list, ignore_ors_errors=False):
        try:
            request = directions(self.client, route_coords, profile="driving-hgv")
        except ORSError as err:
            logging.warning(f'ORS error: {err.message}')
            if not ignore_ors_errors:
                raise HTTPException(
                    status_code=err.status,
                    detail=f'ORS error: {err.message}'
                )
            return 0
        except Timeout:
            logging.error("ORS timeout.")
            if not ignore_ors_errors:
                raise HTTPException(
                    status_code=status.HTTP_408_REQUEST_TIMEOUT,
                    detail="ORS timeout."
                )
            return 0
        try:
            if not request['routes'] or "distance" not in request['routes'][0]["summary"]:
                return 0
            return request['routes'][0]['summary']['distance']
        except Exception as err:
            if ignore_ors_errors:
                return 0
            else:
                raise err

    
    def _calc_cost(self, distance, data):
        return 0
    
    def get_cost(self, data):
        data = data.dict()
        loading_points = data["loading_points"]
        unloading_points = data["unloading_points"]
        route = loading_points + unloading_points
        self._add_route_coords(route)
        distance = self._get_distance(list(map(lambda x: x.get("coordinates"), route)))
        return {"cost": self._calc_cost(distance, data)}
    
    def get_distance(self, data):
        data = data.dict()
        loading_points = data["loading_points"]
        unloading_points = data["unloading_points"]
        route = loading_points + unloading_points
        self._add_route_coords(route)
        distance = self._get_distance(list(map(lambda x: x.get("coordinates"), route)))
        return {"distance": distance}
    
    def create_order(self, user: User, data):
        data = data.dict()
        self._add_route_coords(data["loading_points"], ignore_ors_errors=True)
        self._add_route_coords(data["unloading_points"], ignore_ors_errors=True)
        route_coords = list(map(lambda x: x.get("coordinates"), data["loading_points"] + data["unloading_points"]))
        if all(route_coords):
            distance = self._get_distance(route_coords, ignore_ors_errors=True)
        else:
            distance = 0
        cost = self._calc_cost(distance, data)
        new_order = Order(
            cargo=data["cargo"],
            cost=cost,
            distance=distance,
            loading_time=data["loading_time"],
            weight=data["weight"],
            readable_weight=data["readable_weight"],
            amount=data["amount"],
            temperature_condition=data["temperature_condition"],
            package_type=data["package_type"],
            package_count=data["package_count"],
            customer_id=user.id,
            VAT=data["VAT"],
        )
        self.session.add(new_order)
        self._safe_commit()
        for index, point in enumerate(data["loading_points"]):
            lat = lon = None
            if point.get("coordinates"):
                lon, lat = point["coordinates"]
            new_point = LoadingPoint(
                locality=point["locality"],
                address=point["address"],
                phone=point.get("phone"),
                lon=lon,
                lat=lat,
                order_id=new_order.id,
                index=index
            )
            self.session.add(new_point)
        
        for index, point in enumerate(data["unloading_points"]):
            lat = lon = None
            if point.get("coordinates"):
                lon, lat = point["coordinates"]
            new_point = UnloadingPoint(
                locality=point["locality"],
                address=point["address"],
                phone=point.get("phone"),
                lon=lon,
                lat=lat,
                order_id=new_order.id,
                index=index
            )
            self.session.add(new_point)
        self._safe_commit()

        try:
            body = {
                "customer_name": user.name,
                "readable_id": new_order.readable_id,
                "customer_phone": user.phone,
                "customer_email": user.email,
                "cargo": new_order.cargo,
                "weight": new_order.weight,

                "created_at": new_order.created_at.strftime("%d-%m-%Y %H:%M:%S"),
                "loading_time": new_order.loading_time.strftime("%d-%m-%Y %H:%M"),

                "loading_points": [f'{i.locality}, {i.address}' for i in new_order.loading_points],
                "unloading_points": [f'{i.locality}, {i.address}' for i in new_order.unloading_points]
            }
            requests.post("http://telegram_bot:8000/send_message/", json=body)
        except Exception as err:
            logging.error(err)

        return new_order
    
    def _get_order(self, order_id: int) -> Order:
        order = self.session.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден."
            )
        return order
    
    def get_order(self, user, data):
        data = data.dict()
        order = self._get_order(data["id"])
        if order.customer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден."
            )
        return order

    def _update_order(self, data, order):
        if "cargo" in data:
            order.cargo = data["cargo"]
        if "cost" in data:
            order.cost = data["cost"]
        if "weight" in data:
            order.weight = data["weight"]
        if "amount" in data:
            order.amount = data["amount"]
        if "temperature_condition" in data:
            order.temperature_condition = data["temperature_condition"]
        if "VAT" in data:
            order.VAT = data["VAT"]
        if "status" in data:
            order.status = data["status"]
        if "loading_time" in data:
            order.loading_time = data["loading_time"]
        if "package_type" in data:
            order.package_type = data["package_type"]
        if "package_count" in data:
            order.package_count = data["package_count"]
        if "loading_points" in data:
            list(map(
                lambda x: self.session.delete(x), 
                self.session.query(LoadingPoint).filter(LoadingPoint.order_id == order.id).all()
            ))
            self._add_route_coords(data["loading_points"], ignore_ors_errors=True)
            for index, point in enumerate(data["loading_points"]):
                lat = lon = None
                if point.get("coordinates"):
                    lon, lat = point["coordinates"]
                new_point = LoadingPoint(
                    locality=point["locality"],
                    address=point["address"],
                    phone=point.get("phone"),
                    lon=lon,
                    lat=lat,
                    order_id=order.id,
                    index=index
                )
                self.session.add(new_point)
            
        if "unloading_points" in data:
            list(map(
                lambda x: self.session.delete(x), 
                self.session.query(UnloadingPoint).filter(UnloadingPoint.order_id == order.id).all()
            ))
            self._add_route_coords(data["unloading_points"], ignore_ors_errors=True)
            for index, point in enumerate(data["unloading_points"]):
                lat = lon = None
                if point.get("coordinates"):
                    lon, lat = point["coordinates"]
                new_point = UnloadingPoint(
                    locality=point["locality"],
                    address=point["address"],
                    phone=point.get("phone"),
                    lon=lon,
                    lat=lat,
                    order_id=order.id,
                    index=index
                )
                self.session.add(new_point)
        
        # Update distance if unloading_points or loading_points changed
        if "unloading_points" in data or "loading_points" in data and "distance" not in data:
            route = self.session.query(LoadingPoint).filter(LoadingPoint.order_id == order.id).all() + \
                self.session.query(UnloadingPoint).filter(UnloadingPoint.order_id == order.id).all()
            route = list(map(lambda x: x.coordinates, route))
            order.distance = self._get_distance(route, ignore_ors_errors=True)

        if "distance" in data:
            order.distance = data["distance"]

        self._safe_commit()
        return order

    def update_order_by_admin(self, data):
        data = data.dict(exclude_unset=True)
        order = self._get_order(data["id"])
        return self._update_order(data, order)
    
    def update_order_by_user(self, user, data):
        data = data.dict(exclude_unset=True)
        order = self._get_order(data["id"])
        if order.customer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден."
            )
        return self._update_order(data, order)
    
    def delete_order(self, user, data):
        data = data.dict()
        order = self._get_order(data["id"])
        if order.customer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заказ не найден."
            )
        self.session.delete(order)
        self._safe_commit()
        return {"status": "ok."}