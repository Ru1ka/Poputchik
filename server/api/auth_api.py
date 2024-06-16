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
    """
    Отправка OTP на телефон или email
    """
    return service.send_totp_code(data)


@router.post("/verify_otp", response_model=Token)
async def sign_in(data: VerifyTotpCode, service: UserService = Depends()):
    """
    Проверка OTP
    """
    return service.verify_otp(data)
