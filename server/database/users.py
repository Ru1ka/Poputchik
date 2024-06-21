import sqlalchemy
import datetime
from .db_session import SqlAlchemyBase
from sqlalchemy import orm


class User(SqlAlchemyBase):
    __tablename__ = "Users"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    email = sqlalchemy.Column(sqlalchemy.String, unique=True)
    phone = sqlalchemy.Column(sqlalchemy.String, unique=True) # convert all to 7xxxxxxxxxx
    user_type = sqlalchemy.Column(sqlalchemy.String, nullable=False, default="physical")  # physical / individual
    inn = sqlalchemy.Column(sqlalchemy.String, unique=True, nullable=True)
    created_at = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)

    orders = orm.relationship("Order", back_populates="customer")

    def __repr__(self):
        return f"<User> {self.id} {self.name} {self.phone or self.email}"
