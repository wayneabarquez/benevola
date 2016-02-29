from app import db
from app.models import BaseModel
from geoalchemy2 import Geometry


class Person(BaseModel):
    __abstract__ = True
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))


class Section(BaseModel):
    name = db.Column(db.String(50))
    area = db.Column(Geometry('POLYGON'), nullable=False)

    def get_blocks(self):
        blocks = []
        for blk in self.blocks:
            blocks.append(blk.to_dict())
        return blocks


class Block(BaseModel):
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    name = db.Column(db.String(50))
    area = db.Column(Geometry('POLYGON'), nullable=False)
    section = db.relationship(Section, backref='blocks')


class Client(Person):
    address = db.Column(db.String(100))

    def get_lots(self):
        lots = []
        for lot in self.lots:
            lots.append(lot.to_dict())
        return lots


class Lot(BaseModel):
    block_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    area = db.Column(Geometry('POLYGON'), nullable=False)
    status = db.Column(db.String(20))
    lot_area = db.Column(db.String(10))
    date_purchased = db.Column(db.Date)
    block = db.relationship(Block, backref='lots')
    client = db.relationship(Client, backref='lots')

    def get_deceased(self):
        deceased = []
        for dead in self.deceased:
            deceased.append(dead.to_dict())
        return deceased


class Deceased(Person):
    lot_id = db.Column(db.Integer, db.ForeignKey('lot.id'), nullable=False)
    date_of_death = db.Column(db.Date)
    lot = db.relationship(Lot, backref='deceased')
