from pydantic import BaseModel, Field
from typing import Optional
from schemas.pdc import Order


class Organization(BaseModel):
    id: int
    organization_name: str
    inn: str = Field(..., pattern="^\d{10}$", example="1328087306")

    class Config:
        orm_mode = True


class Profile(BaseModel):
    id: int
    name: str = Field(..., example="Иванов Иван Иванович")
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="your@email.com")
    is_organization_account: bool
    organization: Optional[Organization] = Field(None)

    class Config:
        orm_mode = True


class User(Profile):
    orders: list[Order]


class UsersList(BaseModel):
    users: list[User]


class UpdateMe(BaseModel):
    name: str = Field(None, example="Иванов Иван Иванович")
    inn: str = Field(None, pattern="^\d{10}$", example="1328087306")
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="your@email.com")