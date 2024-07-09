from pydantic import BaseModel, Field
from typing import Optional
from typing import List
from datetime import datetime


class Point(BaseModel):
    locality: str
    address: str
    phone: str = Field(None, pattern="^7\d{10}$", example="70000000000")


class Order(BaseModel):
    cargo: str = Field(..., max_length=100)
    route: list[Point]
    weight: float = Field(..., gt=0, example=10)
    amount: float = Field(..., gt=0, example=10)
    temperature_condition: bool


class OrderCost(Order):
    VAT: bool


class OrderCostReturn(BaseModel):
    cost: int