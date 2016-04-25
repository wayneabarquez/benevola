from app import db
from app.models import BaseModel
from flask.ext.login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class AccountStatusType:
    ACTIVE = 1
    SUSPENDED = 0


class RoleType:
    ADMIN = "ADMIN"
    USER = "USER"


class Role(BaseModel):
    name = db.Column(db.String(10), nullable = False)


class User(BaseModel, UserMixin):
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    account_status = db.Column(db.Integer, default=AccountStatusType.ACTIVE)
    last_login_datetime = db.Column(db.DateTime)

    role = db.relationship(Role, foreign_keys=role_id)

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    # TODO change this to constant
    def is_admin(self):
        return self.role_id == 1

    def __repr__(self):
        return "<User '{}'>".format(self.username)