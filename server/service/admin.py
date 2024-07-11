from fastapi import Depends, status, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from log_config import logger as logging
import jwt
import datetime

from database.users import User
from database.organizations import Organization
from database.db_session import get_session
from database.totp_secrets import TotpSecret
from settings import settings


class AdminService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def _safe_commit(self):
        try:
            self.session.commit()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DB error, invalid data."
            )   

    def _create_jwt(self) -> str:
        payload = {"exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}
        return jwt.encode(payload, settings().JWT_ADMIN_SECRET, algorithm='HS256')
    
    def verify_jwt(self, token):
        try:
            payload = jwt.decode(token, settings().JWT_ADMIN_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="JWT expired."
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong JWT."
            )
        return True
        
    def sign_in(self, data):
        data = data.dict()
        if data["login"] == settings().ADMIN_LOGIN and data["password"] == settings().ADMIN_PASSWORD:
            return {"token": self._create_jwt()}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неправильный логин или пароль."
            )
        
    def get_all_users(self):
        return {"users": list(self.session.query(User).all())}
