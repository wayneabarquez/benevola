from app import db
from app.home.models import Person, Deceased


class Crematorium(Person):
    deceased_id = db.Column(db.Integer, db.ForeignKey('deceased.id'), index=True, nullable=False)
    date_cremated = db.Column(db.Date)
    datetime_started = db.Column(db.DateTime)
    datetime_finished = db.Column(db.DateTime)
    gas_consumed = db.Column(db.Float)  # liters

    deceased = db.relationship(Deceased, backref=db.backref('deceased_occupancy', cascade="all, delete-orphan"))
