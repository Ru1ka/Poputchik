from typing import Annotated

from fastapi import APIRouter, Depends, Query, Path
from fastapi.security import OAuth2PasswordRequestForm

# from service.user import UserService
# from schemas.user_pdc import SendCodeSms
from schemas.auth_pdc import SendCode, CheckLogin
from schemas.pdc import OkReturn
# from api.dependencies import oauth2_scheme

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/check_login", status_code=200, response_model=OkReturn)
async def check_email(data: CheckLogin):
    # TODO: check if user in db
    return {"status": "ok"}

@router.post("/send_code", status_code=200, response_model=OkReturn)
async def send_code(data: SendCode):
    data = data.dict(exclude_unset=True)
    print(data["login"])
    # TODO: send sms or email
    return {"status": "ok"}


# @router.post("/autorize")
# async def sign_in(data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends()):
#     data = SignIn(login=data.username, password=data.password)
#     return {"access_token": service.sign_in(data).token, "token_type": "bearer"}


# @router.post("/register", status_code=201, response_model=RegisterReturn)
# async def register(data: UserRegister, service: UserService = Depends()):
#     """
#     Используется для регистрации нового пользователя по логину и паролю.
#     """
#     return service.register(data)

# @router.post("/token")
# async def sign_in(data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends()):
#     """
#     Костыль для работы локального swagger в /docs
#     """
#     data = SignIn(login=data.username, password=data.password)
#     return {"access_token": service.sign_in(data).token, "token_type": "bearer"}


# @router.post("/sign-in", response_model=Token)
# async def sign_in(data: SignIn, service: UserService = Depends()):
#     return service.sign_in(data)


# dEuybLVI5h
# wMW1eaSFpoIfmp4ours6onlNH0wiViczS5RqxYDeMNuKLV0jDowbsYGmzpHxS1vWolivk33mTOUeC