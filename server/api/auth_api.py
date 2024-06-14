from typing import Annotated

from fastapi import APIRouter, Depends, Query, Path
from fastapi.security import OAuth2PasswordRequestForm

from service.user import UserService
from schemas.auth_pdc import SendCode, SendCodeReturn, VerifyTotpCode, Token
from schemas.pdc import OkReturn
# from api.dependencies import oauth2_scheme

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/send_code", status_code=200, response_model=SendCodeReturn)
async def send_code(data: SendCode, service: UserService = Depends()):
    return service.send_totp_code(data)


@router.post("/verify_otp", response_model=Token)
async def sign_in(data: VerifyTotpCode, service: UserService = Depends()):
    return service.verify_otp(data)


@router.post("/token")
async def sign_in(data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends()):
    """
    Костыль для работы локального swagger в /docs
    """
    data = VerifyTotpCode(login=data.username, password=data.password)
    return {"access_token": service.verify_totp_code(data).token, "token_type": "bearer"}