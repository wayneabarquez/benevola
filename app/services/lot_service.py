from app.utils import forms_helper
from app.exceptions.lot import *
from app import db
from app.services import setting_service, client_service
from app.home.models import Lot, Deceased, Client, DeceasedOccupancy
from app.columbary.models import Columbary
from app.home.forms import AddClientForm
from app.constants.lot_constants import SOLD
from app.crematorium.services import get_cremation_by_date
import datetime
import logging

log = logging.getLogger(__name__)


def compute_lot_amount(area, price_per_sq_mtr):
    return area * price_per_sq_mtr


def get_lots():
    return Lot.query.outerjoin(Client).all()


def get_details(lot_id):
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot {0} not found".format(lot_id))

    data = lot.to_dict()
    amount = compute_lot_amount(lot.lot_area, lot.price_per_sq_mtr)
    data['amount'] = float(amount)

    data['block'] = lot.block

    if lot.client is not None:
        data['client'] = lot.client.to_dict()

    data['deceased'] = lot.get_deceased()
    log.debug("Lot Details: {0}".format(data))
    # log.debug("Compute: {0} x {1} = {2}".format(lot.lot_area, lot.price_per_sq_mtr, amount))

    return data


def create_from_dict(block_id, data):
    # Prepare Data
    lot = Lot.from_dict(data)
    # Area
    lot.block_id = block_id
    lot.area = forms_helper.parse_area(data['area'])

    lot_price = setting_service.get_current_settings()
    if lot_price is not None:
        lot.price_per_sq_mtr = lot_price.price_per_sq_mtr
    else:
        raise LotPriceNullError('Lot Price per Sq/Meter not set.')

    # Persist
    db.session.add(lot)
    db.session.commit()

    return lot


def update_from_dict(lot_id, data):
    # Prepare Data
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    if 'client_id' in data and data['client_id'] == 0:
        data['client_id'] = None

    lot.update_from_dict(data, ['id', 'area', 'date_modified', 'date_created', 'deceased', 'client', 'block'])

    # Update Area
    if 'area' in data:
        lot.area = forms_helper.parse_area(data['area'])

    # Persist
    db.session.commit()

    return lot


def sold_lot(lot_id, form_data):
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    if form_data['client_id'] == 0:
        client_data = form_data['client']
        form = AddClientForm.from_json(client_data)
        if form.validate():
            client = client_service.create_from_dict(client_data)
            lot.client_id = client.id
            # else:
            #     raise ValueError(form.errors)
    else:
        lot.client_id = form_data['client_id']

    if 'date_purchased' in form_data:
        lot.date_purchased = form_data['date_purchased']
    else:
        lot.date_purchased = datetime.datetime.now()

    lot.status = SOLD

    db.session.commit()

    return lot


def add_occupant(lot_id, data):
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    # TODO get from constant
    lot.status = 'occupied'

    # Prepare Data
    deceased = Deceased.from_dict(data)
    # deceased.lot_id = lot.id
    db.session.add(deceased)
    db.session.commit()

    deceased_occupancy = DeceasedOccupancy(deceased_id=deceased.id, ref_id=lot.id, ref_table='lot')
    db.session.add(deceased_occupancy)

    db.session.commit()

    return deceased


def update_lot_area(lot_id, form_data):
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    lot.lot_area = form_data['lot_area']

    db.session.commit()

    return lot


def get_lot_by_date(start_date, end_date):
    list = []
    result = Lot.query.filter(Lot.date_purchased.between(start_date, end_date))
    for item in result:
        item.label = 'Cemetery Lot'
        list.append(item)
    return list


def get_columbary_by_date(start_date, end_date):
    list = []
    result = Columbary.query.filter(Columbary.date_purchased.between(start_date, end_date))
    for item in result:
        item.label = 'Columbary'
        list.append(item)
    return list


# Consolidated Data from lot, cremation
def get_sales_data_by_date(start_date, end_date):
    result = get_lot_by_date(start_date, end_date) + get_columbary_by_date(start_date, end_date)
    # result = get_lot_by_date(start_date, end_date) + get_cremation_by_date(start_date, end_date)

    # sort by date_purchased
    result.sort(key=lambda item: item.date_purchased)
    # result.sort(key=lambda item: item.date_purchased if item.date_purchased is not None else item.date_cremated)

    return result


def delete_lot(lot_id):
    lot = Lot.query.get(lot_id)

    if lot is None:
        raise LotNotFoundError("Lot id={0} not found".format(lot_id))

    db.session.delete(lot)
    db.session.commit()
