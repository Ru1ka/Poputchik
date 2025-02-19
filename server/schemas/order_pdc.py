from pydantic import BaseModel, Field
from datetime import datetime

from schemas.pdc import Order


class Point(BaseModel):
    locality: str = Field(..., example="Санкт-Петербург")
    address: str = Field(..., example="Невский проспект 1")
    phone: str = Field(None, pattern="^7\d{10}$", example="70000000000")



class Route(BaseModel):
    loading_points: list[Point]
    unloading_points: list[Point]


class DistanceReturn(BaseModel):
    distance: int


class OrdersList(BaseModel):
    orders: list[Order]

    class Config:
        orm_mode = True


class CreateOrder(BaseModel):
    cargo: str = Field(..., max_length=100)
    loading_time: datetime
    loading_points: list[Point]
    unloading_points: list[Point]
    weight: float = Field(..., gt=0, example=10)
    readable_weight: str = Field(None, example="10kg")
    amount: float = Field(..., gt=0, example=10)
    temperature_condition: bool
    package_type: str
    package_count: int
    VAT: bool


class OrderCostReturn(BaseModel):
    cost: int


class GetOrder(BaseModel):
    id: int

class UpdateOrder(BaseModel):
    id: int

    cargo: str = None
    cost: int = None
    loading_time: datetime
    distance: int = 0
    weight: int = None
    amount: int = None
    temperature_condition: bool = None
    status: str = None
    loading_points: list[Point] = None
    unloading_points: list[Point] = None
    package_type: str = None
    package_count: int = None
    VAT: bool


class deleteOrder(BaseModel):
    id: int