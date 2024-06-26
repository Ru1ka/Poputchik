from fastapi import Depends, status, HTTPException
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
from schemas.user_pdc import Profile
from schemas.auth_pdc import Token
from settings import settings


class UserService:
    smsaero = SmsAero(settings().SMSAERO_EMAIL, settings().SMSAERO_API_KEY)

    def __init__(self, session: Session = Depends(get_session)):
        self.session = session

    def get_me(self, user: User):
        return Profile.from_orm(user)
    
    def _get_user(self, phone=None, email=None):
        if phone:
            user = self.session.query(User).filter(User.phone == phone).first()
        elif email:
            user = self.session.query(User).filter(User.email == email).first()
        else:
            user = None
        return user

    def user_exists(self, data):
        data = data.dict()
        if not (data["phone"] or data["email"]):
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Отсутствует обязательный параметр (phone или email на выбор).",
            )
        if data["phone"] and data["email"]:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Оставьте только одно поле: email или phone",
            )
        user = self._get_user(phone=data["phone"], email=data["email"])

        return {"user_exists": bool(user)}
    
    def send_totp_code(self, data):
        data = data.dict(exclude_unset=True)
        # Validation
        if "phone" in data and "email" in data:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Слишком много параметров. Выберите один: email или phone.",
            )
        elif "phone" not in data and "email" not in data:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Отсутствует обязательный параметр (phone или email на выбор).",
            )
        
        # Generate OTP
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret, interval=settings().TOTP_LIFETIME)
        otp = totp.now()

        # Check for spam
        totp_contact = data.get("phone", None) or data.get("email", None)
        users_secrets = self.session.query(TotpSecret).filter(TotpSecret.contact == totp_contact)
        for users_secret in users_secrets:
            if users_secret.created_at + datetime.timedelta(seconds=30) >= datetime.datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Новый код можно отправлять раз в 30 секунд."
                )
            self.session.delete(users_secret)
        self.session.commit()

        # Send OTP
        if "phone" in data:
            if settings().SMSAERO_ENABLE:
                try:
                    response = self.smsaero.send(data["phone"], f"Ваш код для putchik.ru: {otp}")
                    # Обработка ошибок sms-aero
                    if not response:
                        logging.warning("sms-aero is offline")
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Sms service is offline, try email."
                        )
                except:
                    logging.warning("sms-aero is offline")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Sms service is offline, try email."
                    )
                if not response["success"]:
                    # str in response["message"], тк доки "API 2.0 SMS Aero" не до конца совпдают с реальностью
                    # Это перестраховка.
                    if "Not enough money" in response["message"]:
                        logging.error("There are not enough funds in the account to send an SMS code.")
                        raise HTTPException(
                                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                detail="Try email."
                            )
                    elif "Invalid ip-address" in response["message"]:
                        logging.error("No access to the sms-api from the current ip server.")
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Try email."
                        )
                    elif "Validation error" in response["message"]:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Wrong phone."
                        )
                    logging.warning(f"sms-api: '{response.message}'.")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"sms-api: '{response.message}'."
                    )
            else:
                logging.info(f"SMSAERO_ENABLE is False; Ваш код для putchik.ru: {otp}")
        else:
            if settings().SMTP_ENABLE:
                try:
                    msg = MIMEMultipart()
                    msg['From'] = settings().SMTP_USER
                    msg['To'] = totp_contact
                    msg['Subject'] = f"Код авторизации Poputchik - {otp}"
                    msg.attach(MIMEText(f"Код авторизации Poputchik - {otp}", 'plain'))
                    server = smtplib.SMTP_SSL(settings().SMTP_SERVER, settings().SMTP_PORT)
                    print(1)
                    server.login(settings().SMTP_USER, settings().SMTP_PASSWORD)
                    text = msg.as_string()
                    server.sendmail(settings().SMTP_USER, totp_contact, text)
                    server.quit()
                except Exception as err:
                    logging.error(f"Failed to send email: {err}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Failed to send email, try sms."
                    )
            else:
                logging.info(f"SMTP_ENABLE is False; Ваш код для putchik.ru: {otp}")
        
        # Save totp secret in db
        new_totp_secret = TotpSecret(contact=totp_contact, secret=secret)
        self.session.add(new_totp_secret)
        try:
            self.session.commit()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DB error, invalid data."
            )

        return {"status": "ok"}
    
    def _create_jwt(self, user) -> str:
        payload = {
            "sub": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=14),
            "custom_data": {"created": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")}
        }
        return jwt.encode(payload, settings().JWT_SECRET, algorithm='HS256')
    
    def _verify_otp(self, data: dict) -> True:
        # Validation
        totp_contact = data.get(data["totp_contact_type"], None)
        if not totp_contact:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Отсутствует выбранный параметр для верификации: {data['totp_contact_type']}",
            )
        # Verification
        totp_secret = self.session.query(TotpSecret).filter(
            TotpSecret.contact == totp_contact, 
            TotpSecret.created_at >= datetime.datetime.utcnow() - datetime.timedelta(seconds=180)
        ).first()
        if not totp_secret:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Пользоватиель с этим '{data['totp_contact_type']}' не делал запроса на получение кода.",
            )
        elif totp_secret.attempts >= 3:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Код был введен неправильно 3 раза, отправьте новый код.",
            )
        totp = pyotp.TOTP(totp_secret.secret, interval=settings().TOTP_LIFETIME)
        if not totp.verify(data["OTP"]):
            totp_secret.attempts += 1
            self.session.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неправильный код."
            )
        self.session.delete(totp_secret)
        self.session.commit()
        return True

    def register(self, data):
        data = data.dict(exclude_unset=True)
        self._verify_otp(data)
        user = self._get_user(data.get("phone"), data.get("email"))
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с этим phone/email уже существует"
            )
        
        if data["user_type"] == "individual" and "inn" not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="user_type == 'individual' должен иметь поле 'inn'"
            )
        # Create user
        del data["OTP"]
        del data["totp_contact_type"]
        user = User(**data)
        self.session.add(user)
        try:
            self.session.commit()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DB error, invalid data."
            )
        return {"token": self._create_jwt(user)}

    def sign_in(self, data):
        data = data.dict(exclude_unset=True)
        self._verify_otp(data)
        user = self._get_user(data.get("phone"), data.get("email"))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Пользователь не зарегистрирован"
            )
        return {"token": self._create_jwt(user)}
    
    def verify_jwt(self, token: str):
        try:
            payload = jwt.decode(token, settings().JWT_SECRET, algorithms=['HS256'])
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
        user = self.session.query(User).filter(User.id == payload["sub"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Wrong user_id, maybe user has been deleted."
            )
        return user