from fastapi import APIRouter, Depends

from service.user import UserService
from schemas.auth_pdc import SendCode, UserExistsReturn, UserExists, SignIn, Token, Register
from schemas.pdc import ErrorResponse, OkReturn
# from api.dependencies import oauth2_scheme

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/user_exists",
    responses={
        200: {"model": UserExistsReturn},
        400: {"description": "Ошибка параметров запроса.", "model": ErrorResponse},
    }
)
async def user_exists(data: UserExists, service: UserService = Depends()):
    """
    Проверка существования пользователя
    """
    return service.user_exists(data)


@router.post(
        "/send_code",
        responses={
            200: {"model": OkReturn},
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
        "/sign_in/verify_otp", 
        responses={
            200: {"model": Token},
            400: {"description": "Ошибка параметров запроса.", "model": ErrorResponse},
            401: {"description": "Неправильный код.", "model": ErrorResponse},
            404: {"description": "Юзер с этим номером/email не делал запроса на получение кода.", "model": ErrorResponse},
            429: {"description": "Код был введен неправильно 3 раза, теперь он недействителен.", "model": ErrorResponse},
        }
)
async def sign_in(data: SignIn, service: UserService = Depends()):
    """
    Вход через OTP
    """
    return service.sign_in(data)


@router.post(
        "/register/verify_otp", 
        status_code=201,
        responses={
            201: {"model": Token},
            400: {"description": "Ошибка параметров запроса.", "model": ErrorResponse},
            409: {"description": "Email/phone уже занят.", "model": ErrorResponse},
            401: {"description": "Неправильный код.", "model": ErrorResponse},
            404: {"description": "Юзер с этим номером/email не делал запроса на получение кода.", "model": ErrorResponse},
            429: {"description": "Код был введен неправильно 3 раза, теперь он недействителен.", "model": ErrorResponse},
        }
)
async def register(data: Register, service: UserService = Depends()):
    """
    Регистрация через OTP
    """
    return service.register(data)
