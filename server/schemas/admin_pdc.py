from pydantic import Field, BaseModel, Extra, validator
from typing import Optional
from datetime import datetime


class SignIn(BaseModel):
    login: str
    password: str