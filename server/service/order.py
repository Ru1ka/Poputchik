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
from database.users import User

class OrderService:
    client = openrouteservice.Client(key=settings().ORS_API_KEY)

    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

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
    
    def get_cost(self, data):
        data = data.dict()
        route = data["route"]
        route_coords = self._add_route_coords(route)
        distance = self._get_distance(route_coords)
        return {"cost": distance}