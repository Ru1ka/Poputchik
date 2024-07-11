from enum import Enum
from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    SERVER_PORT: int
    JWT_SECRET: str
    JWT_ADMIN_SECRET: str
    TOTP_LIFETIME: int

    ADMIN_LOGIN: str
    ADMIN_PASSWORD: str

    SMSAERO_ENABLE: bool
    SMSAERO_EMAIL: str
    SMSAERO_API_KEY: str

    SMTP_ENABLE: bool
    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str

    ORS_API_KEY: str

    # postgresql settings
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str


@lru_cache()
def settings():
    return Settings(
        _env_file="../.env",
        _env_file_encoding="utf-8",
    )
