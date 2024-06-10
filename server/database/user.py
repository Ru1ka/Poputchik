import sqlalchemy
from .db_session import SqlAlchemyBase
import datetime

class User(SqlAlchemyBase):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    email = sqlalchemy.Column(sqlalchemy.String, unique=True)
    phone = sqlalchemy.Column(sqlalchemy.String, unique=True) # convert all to 7xxxxxxxxxx
    password_hash = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    password_updated_time = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)
