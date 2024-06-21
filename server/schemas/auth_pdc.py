from pydantic import Field, BaseModel, Extra, validator
from typing import Optional
from datetime import datetime


class SendCode(BaseModel):
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="example@email.com")

class UserExists(BaseModel):
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="example@email.com")

class UserExistsReturn(BaseModel):
    user_exists: bool

class SignIn(BaseModel):
    OTP: str = Field(..., max_length=6, min_length=6, example="123456")
    totp_contact_type: str = Field(..., choices=["email", "phone"])
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="example@email.com")

    @validator('totp_contact_type')
    def check_contact_type(cls, v):
        if v not in ("phone", "email"):
            raise ValueError("contact_type должен быть 'phone' или 'email'")
        return v

class Register(SignIn):
    name: str = Field(..., example="Иван Иванов")
    user_type: str = Field(..., example="individual")
    inn: str = Field(None, pattern="^[0-9]+$", example="132808730606")

    @validator('user_type')
    def check_contact_type(cls, v):
        if v not in ("physical", "individual"):
            raise ValueError("user_type должен быть 'physical' или 'individual'")
        return v
    
    class Config:
        extra = Extra.forbid

class Token(BaseModel):
    token: str
