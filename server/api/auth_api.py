from typing import Annotated

from fastapi import APIRouter, Depends, Query, Path
from fastapi.security import OAuth2PasswordRequestForm

from service.user import UserService
from schemas.auth_pdc import SendCode, SendCodeReturn, VerifyTotpCode, Token
from schemas.pdc import ErrorResponse
# from api.dependencies import oauth2_scheme

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
        "/send_code", 
        status_code=200, 
        responses={
            200: {"model": SendCodeReturn},
            400: {"description": "Ошибка параметров запроса.", "model": ErrorResponse},
            429: {"description": "Слишком частая отправка кода на один номер/email.", "model": ErrorResponse},
            500: {"description": "Непредвиденная ошибка SMSAERO или SMTP сервера. Отправка кода невозможна.", "model": ErrorResponse},
            503: {"description": "Ошибка SMSAERO или SMTP сервера. Отправка кода невозможна.", "model": ErrorResponse},
        }
)
async def send_code(data: SendCode, service: UserService = Depends()):
    """
    Отправка OTP на телефон или email
    """
    return service.send_totp_code(data)


@router.post(
        "/verify_otp", 
        status_code=201,
        responses={
            201: {"model": Token},
            400: {"description": "Ошибка параметров запроса.", "model": ErrorResponse},
            401: {"description": "Неправильный код.", "model": ErrorResponse},
            404: {"description": "Юзер с этим номером/email не делал запроса на получение кода.", "model": ErrorResponse},
            429: {"description": "Код был введен неправильно 3 раза, теперь он недействителен.", "model": ErrorResponse},
        }
)
async def sign_in(data: VerifyTotpCode, service: UserService = Depends()):
    """
    Проверка OTP
    """
    return service.verify_otp(data)
