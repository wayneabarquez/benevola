from app import db
from app.models import BaseModel
from app.home.models import Deceased


class FuneralHomes(BaseModel):
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.Text)


class Crematorium(BaseModel):
    deceased_id = db.Column(db.Integer, db.ForeignKey('deceased.id'), index=True, nullable=True)
    funeral_home_id = db.Column(db.Integer, db.ForeignKey('funeral_homes.id', ondelete='SET NULL'), nullable=True)
    date_cremated = db.Column(db.Date, nullable=False)
    time_started = db.Column(db.String, nullable=False)
    time_finished = db.Column(db.String, nullable=False)
    gas_consumed = db.Column(db.Float)  # liters

    deceased = db.relationship(Deceased, backref=db.backref('cremations', cascade="all, delete-orphan"))
    funeral_homes = db.relationship(FuneralHomes)
