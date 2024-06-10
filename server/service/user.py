# from fastapi import Depends, status
# from sqlalchemy.exc import IntegrityError
# from sqlalchemy.orm import Session
# import bcrypt
# import jwt
# import datetime

# # from database.db_session import get_session
# # from database.user import User
# # from database.country import Country
# from schemas.user_pdc import Profile, Token, UpdatePassword, UpdateUser, AddFriend, FriendsReturnObject, RemoveFriend
# from errors import APIError
# # from CONSTANTS import JWT_SECRET_KEY

# class UserService:
#     def __init__(self, session: Session = Depends(get_session)):
#         self.session = session