from app import db
from app.models import BaseModel
from app.home.models import Client, DeceasedOccupancy


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

    @property
    def client_name(self):
        return '' if self.client is None else self.client.last_name + ', ' + self.client.first_name

    def get_deceased(self):
        # deceased = []
        result = DeceasedOccupancy.query.filter_by(ref_table='columbary', ref_id=self.id).first()

        if result is not None:
            return result.deceased.to_dict()

        return result
        # for d in result:
        #     deceased.append(d.deceased.to_dict())
        # return deceased
