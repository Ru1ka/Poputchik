from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OkReturn(BaseModel):
    status: str = "ok"



class ErrorResponse(BaseModel):
    detail: str = Field(..., example="Description of the error.")
