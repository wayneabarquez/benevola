from app.utils import forms_helper
from app.exceptions.lot import *
from app import db
from app.services import setting_service
from app.home.models import Lot
import logging

log = logging.getLogger(__name__)


def get_lots():
    return Lot.query.all()


def create_from_dict(block_id, data):
    # Prepare Data
    lot = Lot.from_dict(data)
    # Area
    lot.block_id = block_id
    lot.area = forms_helper.parse_area(data['area'])

    lot_price = setting_service.get_current_settings()
    if lot_price is not None:
        lot.price_per_sq_mtr = lot_price.price_per_sq_mtr

    # Persist
    db.session.add(lot)
    db.session.commit()

    return lot


def update_from_dict(lot_id, data):
    # Prepare Data
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    lot.update_from_dict(data, ['id', 'area', 'date_modified', 'date_created'])

    # Update Area
    lot.area = forms_helper.parse_area(data['area'])

    # Persist
    db.session.commit()

    return lot

