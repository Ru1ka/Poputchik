from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from service.user import UserService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def verify_jwt(token: str = Depends(oauth2_scheme), service: UserService = Depends()):
    return service.verify_jwt(token)
