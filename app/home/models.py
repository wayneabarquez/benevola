from app import db
from app.models import BaseModel
from geoalchemy2 import Geometry


class Person(BaseModel):
    __abstract__ = True
    first_name = db.Column(db.String(100), index=True, nullable=False)
    last_name = db.Column(db.String(100), index=True, nullable=False)
    middle_name = db.Column(db.String(100))


class Section(BaseModel):
    name = db.Column(db.String(10), index=True)
    area = db.Column(Geometry('POLYGON'), nullable=False)

    def get_blocks(self):
        blocks = []
        for blk in self.blocks:
            blocks.append(blk.to_dict())
        return blocks

    def get_lots(self):
        lots = []
        for blk in self.blocks:
            lots = lots + blk.get_lots()
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
    # dimension_width = db.Column(db.Float)  # ex. 5 x 6
    # dimension_height = db.Column(db.Float)  # ex. 5 x 6
    dimension = db.Column(db.String)  # ex. 4x4x6
    lot_area = db.Column(db.Float)  # By Square meters (Computed by dimensions w x h)
    price_per_sq_mtr = db.Column(db.Float)  # copied from lot_price table
    date_purchased = db.Column(db.Date, default=db.func.current_date())
    or_no = db.Column(db.String(10))
    status = db.Column(db.String(20), index=True, default='vacant')  # [vacant, sold, occupied]
    remarks = db.Column(db.Text)

    block = db.relationship(Block, backref='lots')
    client = db.relationship(Client)

    def get_deceased(self):
        deceased = []
        for d in self.deceased:
            deceased.append(d.to_dict())
        return deceased


class Deceased(Person):
    lot_id = db.Column(db.Integer, db.ForeignKey('lot.id'), index=True, nullable=False)
    date_of_death = db.Column(db.Date)

    lot = db.relationship(Lot, backref=db.backref('deceased', cascade="all, delete-orphan"))
