from pydantic import BaseModel, Field, Extra
from typing import Optional
from datetime import datetime



class OkReturn(BaseModel):
    status: str = "ok"


class ErrorResponse(BaseModel):
    detail: str = Field(..., example="Description of the error.")

class PointORM(BaseModel):
    lat: str = None
    lon: str = None
    index: int

    class Config:
        orm_mode = True
        

class Order(BaseModel):
    id: int
    readable_id: str
    customer_id: int

    cargo: str
    created_at: datetime
    cost: int
    distance: int
    weight: int
    amount: int
    temperature_condition: bool
    status: str

    loading_points: list[PointORM]
    unloading_points: list[PointORM]

    class Config:
        orm_mode = True