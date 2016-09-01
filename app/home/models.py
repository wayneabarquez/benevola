from app import db
from app.models import BaseModel
from geoalchemy2 import Geometry
from datetime import date


class Person(BaseModel):
    __abstract__ = True
    first_name = db.Column(db.String(100), index=True, nullable=False)
    last_name = db.Column(db.String(100), index=True, nullable=False)
    middle_name = db.Column(db.String(100))
    gender = db.Column(db.String(6))
    date_of_birth = db.Column(db.Date)

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    @property
    def age(self):
        if self.date_of_birth is None:
            return ''

        today = date.today()
        return today.year - self.date_of_birth.year


class Section(BaseModel):
    name = db.Column(db.String(10), index=True)
    area = db.Column(Geometry('POLYGON'), nullable=False)

    def get_blocks(self):
        blocks = []
        for blk in self.blocks:
            blocks.append(blk.to_dict())
        # return sorted(blocks, key=lambda k: k['name'])
        return blocks

    def get_lots(self):
        lots = []
        for blk in self.blocks:
            lots = lots + blk.get_lots()
        # return sorted(lots, key=lambda k: k['name'])
        return lots


class Block(BaseModel):
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    name = db.Column(db.String(10), index=True)
    area = db.Column(Geometry('POLYGON'), nullable=False)

    section = db.relationship(Section, backref='blocks')

    def get_lots_obj(self):
        lots = []
        for lot in self.lots:
            lots.append(lot)
        return lots

    def get_lots(self):
        lots = []
        for lot in self.lots:
            lots.append(lot.to_dict())
        return lots


class Client(Person):
    address = db.Column(db.String(100))

    def get_full_name(self):
        return self.last_name + ', ' + self.first_name

    # def get_lots(self):
    #     lots = []
    #     for lot in self.lots:
    #         lots.append(lot.to_dict())
    #     return lots


class LotPrice(BaseModel):
    price_per_sq_mtr = db.Column(db.Float)
    date_price_effective = db.Column(db.Date, default=db.func.current_date())


class Settings(BaseModel):
    lot_price_id = db.Column(db.Integer, db.ForeignKey('lot_price.id'), nullable=False)


class Lot(BaseModel):
    block_id = db.Column(db.Integer, db.ForeignKey('block.id'), index=True, nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), index=True)  # Lot Owner
    name = db.Column(db.String(5))
    area = db.Column(Geometry('POLYGON'), nullable=False)
    dimension = db.Column(db.String)  # ex. 4x4x6
    lot_area = db.Column(db.Float)  # By Square meters (Computed by dimensions w x h)
    price_per_sq_mtr = db.Column(db.Float)  # copied from lot_price table
    date_purchased = db.Column(db.Date)
    or_no = db.Column(db.String(10))
    status = db.Column(db.String(20), index=True, default='vacant')  # [vacant, sold, occupied]
    remarks = db.Column(db.Text)

    block = db.relationship(Block, backref='lots')
    client = db.relationship(Client)

    def get_deceased(self):
        deceased = []
        result = DeceasedOccupancy.query.filter_by(ref_table='lot', ref_id=self.id).all()

        for d in result:
            deceased.append(d.deceased.to_dict())
        return deceased


# TODO: make this independent to lot_id
# columns: ref_id, ref_table, date_of_death
class Deceased(Person):
    date_of_death = db.Column(db.Date)


class DeceasedOccupancy(BaseModel):
    deceased_id = db.Column(db.Integer, db.ForeignKey('deceased.id'), index=True, nullable=False)
    ref_id = db.Column(db.Integer, index=True, nullable=False)
    ref_table = db.Column(db.String(20), index=True, nullable=False)

    deceased = db.relationship(Deceased, backref=db.backref('deceased_occupancy', cascade="all, delete-orphan"))
