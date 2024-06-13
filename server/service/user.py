from fastapi import Depends, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
import bcrypt
import jwt
import datetime

from database.db_session import get_session
from database.user import User
# from database.country import Country
from schemas.user_pdc import Profile, Token, UpdatePassword, UpdateUser, AddFriend, FriendsReturnObject, RemoveFriend
from errors import APIError
from settings import settings

class UserService:
    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_me(self, user: User):
        return Profile.from_orm(user)
    
    def sign_in(self, data):
        data = data.dict(exclude_unset=True)
        user = self.session.query(User).filter(User.login == data["login"]).first()
        if not user:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                reason="Пользователь с таким login не найден"
            )
        if not bcrypt.checkpw(data["password"].encode("utf-8"), user.password):
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                reason="Неверный пароль"
            )
        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        payload = {
            "sub": user.id,
            "exp": expiration,
            "custom_data": {"created": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")}
        }
        jwt_token = jwt.encode(payload, settings().JWT_SECRET, algorithm='HS256')

        return Token(token=jwt_token)
    
    def verify_jwt(self, token: str):
        try:
            payload = jwt.decode(token, settings().JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                reason="JWT expired"
            )
        except jwt.InvalidTokenError:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                reason="Wrong JWT"
            )
        
        user = self.session.query(User).filter(User.id == payload["sub"]).first()
        if not user:
            raise APIError(
                status_code=status.HTTP_401_UNAUTHORIZED,
                reason="Wrong user_id, maybe user has been deleted"
            )
        # if user.password_updated_time > datetime.datetime.strptime(payload["custom_data"]["created"], "%Y-%m-%dT%H:%M:%S.%f"):
        #     raise APIError(
        #         status_code=status.HTTP_401_UNAUTHORIZED,
        #         reason="Password has been changed, log in again"
        #     )

        return user