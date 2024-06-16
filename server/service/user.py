from fastapi import Depends, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from log_config import logger as logging
import jwt
import pyotp
import datetime
from smsaero import SmsAero
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from database.users import User
from database.db_session import get_session
from database.totp_secrets import TotpSecret
# from schemas.user_pdc import Profile, Token, UpdatePassword, UpdateUser, AddFriend, FriendsReturnObject, RemoveFriend
from schemas.auth_pdc import Token
from errors import APIError
from settings import settings


class UserService:
    smsaero = SmsAero(settings().SMSAERO_EMAIL, settings().SMSAERO_API_KEY)

    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    # def get_me(self, user: User):
    #     return Profile.from_orm(user)
    
    def send_totp_code(self, data):
        data = data.dict(exclude_unset=True)
        # Validation
        if "phone" in data and "email" in data:
            raise APIError(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    reason="Слишком много параметров. Выберите один: email или phone",
            )
        elif "phone" not in data and "email" not in data:
            raise APIError(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    reason="Отсутствует обязательный параметр (phone или email на выбор)",
            )
        
        # Generate OTP
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret, interval=settings().TOTP_LIFETIME)
        otp = totp.now()

        # Check for spam
        totp_contact = data.get("phone", None) or data.get("email", None)
        users_secrets = self.session.query(TotpSecret).filter(TotpSecret.contact == totp_contact)
        for users_secret in users_secrets:
            if users_secret.created_time + datetime.timedelta(seconds=30) >= datetime.datetime.now():
                raise APIError(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    reason="Новый код можно отправлять раз в 30 секунд"
                )
            self.session.delete(users_secret)
        self.session.commit()
        new_totp_secret = TotpSecret(contact=totp_contact, secret=secret)
        self.session.add(new_totp_secret)
        try:
            self.session.commit()
        except IntegrityError:
            raise APIError(
                status_code=status.HTTP_400_BAD_REQUEST,
                reason="Invalid data"
            )
        # Send OTP
        if "phone" in data:
            if settings().SMSAERO_ENABLE:
                try:
                    response = self.smsaero.send(data["phone"], f"Ваш код для putchik.ru: {otp}")
                    # Обработка ошибок sms-aero
                    if not response:
                        logging.warning("sms-aero is offline")
                        raise APIError(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            reason="Sms service is offline, try email"
                        )
                except:
                    logging.warning("sms-aero is offline")
                    raise APIError(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        reason="Sms service is offline, try email"
                    )
                if not response["success"]:
                    # str in response["message"], тк доки "API 2.0 SMS Aero" не до конца совпдают с реальностью
                    # Это перестраховка.
                    if "Not enough money" in response["message"]:
                        logging.error("There are not enough funds in the account to send an SMS code")
                        raise APIError(
                                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                reason="Try email"
                            )
                    elif "Invalid ip-address" in response["message"]:
                        logging.error("No access to the sms-api from the current ip server")
                        raise APIError(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            reason="Try email"
                        )
                    elif "Validation error" in response["message"]:
                        raise APIError(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            reason="Wrong phone"
                        )
                    logging.warning(f"sms-api: {response.message}")
                    raise APIError(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        reason=f"sms-api: {response.message}"
                    )
            else:
                logging.info(f"Ваш код для putchik.ru: {otp}")
        else:
            if settings().SMTP_ENABLE:
                try:
                    msg = MIMEMultipart()
                    msg['From'] = settings().SMTP_USER
                    msg['To'] = totp_contact
                    msg['Subject'] = f"Код авторизации Poputchik - {otp}"
                    msg.attach(MIMEText(f"Код авторизации Poputchik - {otp}", 'plain'))
                    server = smtplib.SMTP("smtp.gmail.com", 587)
                    server.starttls()
                    server.login(settings().SMTP_USER, settings().SMTP_PASSWORD)
                    text = msg.as_string()
                    server.sendmail(settings().SMTP_USER, totp_contact, text)
                    server.quit()
                except Exception as err:
                    logging.error(f"Failed to send email: {err}")
                    raise APIError(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        reason=f"Failed to send email, try sms"
                    )
            else:
                logging.info(f"Ваш код для putchik.ru: {otp}")

        user_exists = bool(self.session.query(User).filter(User.phone == totp_contact).first())
        return {"user_exists": user_exists}
        
        
    def verify_otp(self, data):
        data = data.dict(exclude_unset=True)
        if "phone" in data:
            totp_secret = self.session.query(TotpSecret).filter(TotpSecret.contact == data["phone"]).first()
            if not totp_secret:
                raise APIError(
                    status_code=status.HTTP_404_NOT_FOUND,
                    reason="Юзер с этим номером не делал запроса на получение смс-кода",
            )
            totp = pyotp.TOTP(totp_secret.secret, interval=settings().TOTP_LIFETIME)
            if not totp.verify(data["OTP"]):
                raise APIError(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    reason="Не правильный смс-код"
                )
            user = self.session.query(User).filter(User.phone == data["phone"]).first()
        elif "email" in data:
            pass
            # TODO
        else:
            raise APIError(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    reason="Отсутствует обязательный параметр (phone или email)",
            )
        
        if not user:
            del data["OTP"]
            user = User(**data)
            try:
                self.session.commit()
            except IntegrityError:
                raise APIError(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    reason="Invalid data"
                )

        payload = {
            "sub": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=14),
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
        return user