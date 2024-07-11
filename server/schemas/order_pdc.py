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
    loading_points: list[Point]
    unloading_points: list[Point]
    weight: float = Field(..., gt=0, example=10)
    amount: float = Field(..., gt=0, example=10)
    temperature_condition: bool


class OrderCostReturn(BaseModel):
    cost: int


class UpdateOrder(BaseModel):
    id: int

    cargo: str = None
    cost: int = None
    distance: int = None
    weight: int = None
    amount: int = None
    temperature_condition: bool = None
    status: str = None