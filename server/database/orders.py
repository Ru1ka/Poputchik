import sqlalchemy
from sqlalchemy import orm
import uuid
from .db_session import SqlAlchemyBase
import datetime

class Order(SqlAlchemyBase):
    __tablename__ = "Orders"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column("id", sqlalchemy.Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    created_at = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)

    customer_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('Users.id'))
    customer = orm.relationship("User", back_populates="orders")
