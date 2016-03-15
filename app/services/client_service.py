from app.utils import forms_helper
from app.exceptions.client import *
from app import db
from app.home.models import Client
import logging

log = logging.getLogger(__name__)


def get_clients():
    return Client.query.all()


def create_from_dict(data):
    # Prepare Data
    client = Client.from_dict(data)
    # Persist
    db.session.add(client)
    db.session.commit()

    return client


# def update_from_dict(block_id, data):
#     # Prepare Data
#     block = Block.query.get(block_id)
#
#     if block is None:
#         raise BlockNotFoundError("Block id={0} not found".format(block_id))
#
#     block.update_from_dict(data, ['id', 'area', 'lots', 'date_modified', 'date_created'])
#
#     # Update Area
#     block.area = forms_helper.parse_area(data['area'])
#
#     # Persist
#     db.session.commit()
#
#     return block

