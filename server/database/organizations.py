import sqlalchemy
import datetime
from .db_session import SqlAlchemyBase
from sqlalchemy import orm


class Organization(SqlAlchemyBase):
    __tablename__ = "Organizations"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    organization_name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    inn = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    created_at = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)

    organization_account = orm.relationship("User", back_populates="organization", uselist=False)
