from app.utils import forms_helper
from app.exceptions.block import *
from app import db
from app.home.models import Block
import logging

log = logging.getLogger(__name__)


def get_blocks():
    return Block.query.all()


def get_blocks_for_section(sectionid):
    return Block.query.filter_by(section_id=sectionid).all()


def create_from_dict(section_id, data):
    # Prepare Data
    block = Block.from_dict(data)
    # Area
    block.section_id = section_id
    block.area = forms_helper.parse_area(data['area'])
    # Persist
    db.session.add(block)
    db.session.commit()

    return block


def update_from_dict(block_id, data):
    # Prepare Data
    block = Block.query.get(block_id)

    if block is None:
        raise BlockNotFoundError("Block id={0} not found".format(block_id))

    block.update_from_dict(data, ['id', 'area', 'lots', 'date_modified', 'date_created'])

    # Update Area
    block.area = forms_helper.parse_area(data['area'])

    # Persist
    db.session.commit()

    return block

