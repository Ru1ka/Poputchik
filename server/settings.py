from enum import Enum
from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    SERVER_PORT: int
    JWT_SECRET: str

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


# from pydantic import BaseSettings

# class Settings(BaseSettings):
#     postgres_user: str
#     postgres_password: str
#     postgres_db: str
#     pgadmin_default_email: str
#     pgadmin_default_password: str
#     domain: str
#     debug: bool
#     environment: str
#     server_port: int

#     class Config:
#         env_file = ".env"

# settings = Settings()