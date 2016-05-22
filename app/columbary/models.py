from app import db
from app.models import BaseModel
from app.home.models import Client
from geoalchemy2 import Geometry


class ColumbaryBlockType:
    A = "A"
    B = "B"


class Columbary(BaseModel):
    c_no = db.Column(db.Integer)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), index=True)  # Lot Owner
    block = db.Column(db.String(1), default=ColumbaryBlockType.A)
    price = db.Column(db.Float)
    date_purchased = db.Column(db.Date)
    or_no = db.Column(db.String(10))
    status = db.Column(db.String(20), index=True, default='vacant')  # [vacant, sold, occupied]
    remarks = db.Column(db.Text)

    client = db.relationship(Client)

    # def get_deceased(self):
    #     deceased = []
    #     for d in self.deceased:
    #         deceased.append(d.to_dict())
    #     return deceased
