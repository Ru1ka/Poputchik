from fastapi import Depends, status, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import openrouteservice
from openrouteservice.geocode import pelias_search
from openrouteservice.directions import directions
from openrouteservice.exceptions import ApiError

from log_config import logger as logging
from settings import settings
from database.db_session import get_session
from database.orders import Order
from database.loading_points import LoadingPoint
from database.unloading_points import UnloadingPoint

class OrderService:
    client = openrouteservice.Client(key=settings().ORS_API_KEY)

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
        route_coords = []
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
                route_coords += [coordinates]
            except ApiError as err:
                logging.warning(f'ORS error: {err.message}')
                if not ignore_ors_errors:
                    raise HTTPException(
                        status_code=err.status,
                        detail=err.message
                    )
                return False
        return route_coords


    def _get_distance(self, route_coords, ignore_ors_errors=False):
        try:
            request = directions(self.client, route_coords, profile="driving-hgv")
        except ApiError as err:
            logging.warning(f'ORS error: {err.message}')
            if not ignore_ors_errors:
                raise HTTPException(
                    status_code=err.status,
                    detail=f'ORS error: {err.message}'
                )
            return False
        return request['routes'][0]['summary']['distance']
    
    def _calc_cost(self, distance, data):
        return 0
    
    def get_cost(self, data):
        data = data.dict()
        loading_points = data["loading_points"]
        unloading_points = data["unloading_points"]
        route_coords = self._add_route_coords(loading_points + unloading_points)
        distance = self._get_distance(route_coords)
        return {"cost": distance}
    
    def get_distance(self, data):
        data = data.dict()
        loading_points = data["loading_points"]
        unloading_points = data["unloading_points"]
        route_coords = self._add_route_coords(loading_points + unloading_points)
        distance = self._get_distance(route_coords)
        return {"distance": distance}
    
    def create_order(self, user, data):
        data = data.dict()
        loading_points = self._add_route_coords(data["loading_points"], ignore_ors_errors=True)
        unloading_points = self._add_route_coords(data["unloading_points"], ignore_ors_errors=True)
        if loading_points and unloading_points:
            route_coords = loading_points + unloading_points
            distance = self._get_distance(route_coords, ignore_ors_errors=True)
            if not distance:
                distance = 0
        else:
            distance = 0
        loading_points = data["loading_points"]
        unloading_points = data["unloading_points"]
        cost = self._calc_cost(distance, data)
        new_order = Order(
            cargo=data["cargo"],
            cost=cost,
            distance=distance,
            weight=data["weight"],
            amount=data["amount"],
            temperature_condition=data["temperature_condition"],
            customer_id=user.id
        )
        self.session.add(new_order)
        self._safe_commit()
        for index, point in enumerate(loading_points):
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
        
        for index, point in enumerate(unloading_points):
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
        return new_order

    def update_order(self, data):
        data = data.dict()
        order = self.session.query(Order).filter(Order.id == data["id"]).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Не существующий заказ."
            )
        if "cargo" in data:
            order.cargo = data["cargo"]
        if "distance" in data:
            order.distance = data["distance"]
        if "cost" in data:
            order.cost = data["cost"]
        if "weight" in data:
            order.weight = data["weight"]
        if "amount" in data:
            order.amount = data["amount"]
        if "temperature_condition" in data:
            order.temperature_condition = data["temperature_condition"]
        if "status" in data:
            order.status = data["status"]

        self._safe_commit()
        return order