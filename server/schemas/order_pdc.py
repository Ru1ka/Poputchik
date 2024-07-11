from pydantic import BaseModel, Field
from datetime import datetime


class Point(BaseModel):
    locality: str = Field(..., example="Санкт-Петербург")
    address: str = Field(..., example="Невский проспект 1")
    phone: str = Field(None, pattern="^7\d{10}$", example="70000000000")


class PointORM(BaseModel):
    lat: str = None
    lon: str = None
    index: int

    class Config:
        orm_mode = True


class Route(BaseModel):
    loading_points: list[Point]
    unloading_points: list[Point]


class DistanceReturn(BaseModel):
    distance: int


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