from fastapi import Depends, status, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from log_config import logger as logging
import jwt
import pyotp
import datetime
from smsaero import SmsAero, SmsAeroException
import smtplib
from email.utils import formataddr
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from database.users import User
from database.organizations import Organization
from database.db_session import get_session
from database.totp_secrets import TotpSecret
from settings import settings


class UserService:
    smsaero = SmsAero(settings().SMSAERO_EMAIL, settings().SMSAERO_API_KEY)

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

    def get_me(self, user: User):
        return user
    
    def get_orders(self, user: User):
        return user
    
    def _get_user(self, phone=None, email=None):
        user = None
        if phone:
            user = self.session.query(User).filter(User.phone == phone).first()
        if email and not user:
            user = self.session.query(User).filter(User.email == email).first()
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
                    detail="Оставьте только одно поле: email или phone.",
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
        totp = pyotp.TOTP(secret)
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
                    response = self.smsaero.send_sms(int(data["phone"]), f"Ваш код для putchik.ru: {otp}")
                    # Обработка ошибок sms-aero
                    if not response:
                        logging.warning("sms-aero is offline")
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Sms service is offline, try email."
                        )
                except SmsAeroException as err:
                    logging.warning(f"sms-aero error: {err}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Sms service is offline, try email."
                    )
                except Exception as err:
                    logging.info(f"sms-aero error: {err}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Sms service error: {err}"
                    )
            else:
                logging.info(f"SMSAERO_ENABLE is False; Ваш код для putchik.ru: {otp}")
        else:
            if settings().SMTP_ENABLE:
                try:
                    smtp_server = smtplib.SMTP_SSL(settings().SMTP_SERVER, settings().SMTP_PORT)
                    smtp_server.login(settings().SMTP_USER, settings().SMTP_PASSWORD)
                    msg = MIMEMultipart()
                    msg['From'] = formataddr((str(Header("Попутчик", 'utf-8')), settings().SMTP_USER))
                    msg['To'] = totp_contact
                    msg['Subject'] = f"Код авторизации putchik.ru - {otp}"
                    msg.attach(MIMEText(f"Код авторизации putchik.ru - {otp}", 'plain'))
                    text = msg.as_string()
                    smtp_server.sendmail(settings().SMTP_USER, totp_contact, text)
                except Exception as err:
                    logging.error(f"Failed to send email: {err}")
                    # TODO: 500 -> 503
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail=f"Failed to send email, try sms."
                    )
            else:
                logging.info(f"SMTP_ENABLE is False; Ваш код для putchik.ru: {otp}")

        # Save totp secret in db
        new_totp_secret = TotpSecret(contact=totp_contact, secret=secret)
        self.session.add(new_totp_secret)
        self._safe_commit()

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
                    detail=f"Отсутствует выбранный параметр для верификации: {data['totp_contact_type']}.",
            )
        # Verification
        totp_secret = self.session.query(TotpSecret).filter(
            TotpSecret.contact == totp_contact, 
            TotpSecret.created_at >= datetime.datetime.utcnow() - datetime.timedelta(seconds=settings().TOTP_LIFETIME)
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
        totp = pyotp.TOTP(totp_secret.secret)
        if not totp.verify(data["OTP"], valid_window=settings().TOTP_LIFETIME):
            totp_secret.attempts += 1
            self.session.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неправильный код."
            )
        self.session.delete(totp_secret)
        self.session.commit()
        return True

    def register(self, data, as_organization=False):
        data = data.dict(exclude_unset=True)
        self._verify_otp(data)
        user = self._get_user(data.get("phone"), data.get("email"))
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с этим phone/email уже существует."
            )
        # Create user
        if as_organization:
            organization = Organization(organization_name=data["organization_name"], inn=data["inn"])
            self.session.add(organization)
            self._safe_commit()
            user = User(
                name=data.get("organization_name"),
                email=data.get("email"),
                phone=data.get("phone"),
                is_organization_account=True,
                organization_id=organization.id
            )
            self.session.add(user)
        else:
            user = User(
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                is_organization_account=False,
            )
            self.session.add(user)
        self._safe_commit()
        return {"token": self._create_jwt(user)}

    def sign_in(self, data):
        data = data.dict(exclude_unset=True)
        self._verify_otp(data)
        if data["totp_contact_type"] == "phone":
            user = self._get_user(data.get("phone"))
        else:
            user = self._get_user(email=data.get("email"))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Пользователь не зарегистрирован."
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
    
    def update_me(self, user: User, data):
        data = data.dict(exclude_unset=True)
        if "name" in data:
            user.name = data["name"]
            if user.organization:
                user.organization.organization_name = data["name"]
        if "email" in data:
            if not data["email"] and not user.phone:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Нельзя удалить единственный контакт."
                )
            if user.email != data["email"] and self._get_user(email=data["email"]):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Пользователь с этим email уже существует."
                )
            user.email = data["email"]
        if "phone" in data:
            if not data["phone"] and not user.email:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Нельзя удалить единственный контакт."
                )
            if user.phone != data["phone"] and self._get_user(phone=data["phone"]):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Пользователь с этим phone уже существует."
                )
            user.phone = data["phone"]
        
        if "inn" in data:
            if user.organization:
                user.organization.inn = data["inn"]
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="У пользователя нет организации, нельзя поменять ИНН."
                )
        self._safe_commit()
        return user
