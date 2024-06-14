import sqlalchemy
from .db_session import SqlAlchemyBase
from sqlalchemy import orm


class TotpSecret(SqlAlchemyBase):
    __tablename__ = "Totp_secrets"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    contact = sqlalchemy.Column(sqlalchemy.String, nullable=False, unique=True)
    secret = sqlalchemy.Column(sqlalchemy.String, nullable=False)