from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from service.user import UserService
from service.admin import AdminService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_jwt(token: str = Depends(oauth2_scheme), service: UserService = Depends()):
    return service.verify_jwt(token)


def verify_admin_jwt(token: str = Depends(oauth2_scheme), service: AdminService = Depends()):
    return service.verify_jwt(token)