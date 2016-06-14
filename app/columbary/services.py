from app.columbary.models import *
from app.home.models import Deceased, DeceasedOccupancy
from .exceptions import ColumbaryNotFoundError
from app import db
import datetime
import logging

log = logging.getLogger(__name__)


def get_list():
    return Columbary.query.all()


def get_columbary(params):
    block = 'A'
    if 'block' in params:
        block = params['block']

    return Columbary.query.filter_by(block=block).order_by(Columbary.c_no.asc())


def get_details(c_id):
    columbary = Columbary.query.get(c_id)

    if columbary is None:
        raise ColumbaryNotFoundError("Lot {0} not found".format(c_id))

    data = columbary.to_dict()
    # amount = compute_lot_amount(lot.lot_area, lot.price_per_sq_mtr)
    data['amount'] = float(10000)

    if columbary.client is not None:
        data['client'] = columbary.client.to_dict()

    data['deceased'] = columbary.get_deceased()
    log.debug("Columbary Details: {0}".format(data))

    return data


def update_columbary(c_id, data):
    columbary = Columbary.query.get(c_id)

    if columbary is None:
        raise ColumbaryNotFoundError("Lot {0} not found".format(c_id))

    columbary.update_from_dict(data, ['id', 'client'])

    # if 'status' not in data and columbary.status == 'sold':
    #     columbary.date_purchased = datetime.datetime.now()

    db.session.commit()
    return columbary


def sold_columbary(c_id, form_data):
    from app.home.forms import AddClientForm
    from app.services import client_service
    from app.constants.lot_constants import SOLD

    columbary = Columbary.query.get(c_id)

    if columbary is None:
        raise ColumbaryNotFoundError("Columbary id={0} not found".format(c_id))

    if 'client_id' not in form_data:
        client_data = form_data['client']
        form = AddClientForm.from_json(client_data)
        if form.validate():
            client = client_service.create_from_dict(client_data)
            columbary.client_id = client.id
    else:
        columbary.client_id = form_data['client_id']

    if 'date_purchased' in form_data:
        columbary.date_purchased = form_data['date_purchased']
    else:
        columbary.date_purchased = datetime.datetime.now()

    columbary.status = SOLD

    db.session.commit()

    return columbary


def add_occupant(c_id, data):
    columbary = Columbary.query.get(c_id)

    if columbary is None:
        raise ColumbaryNotFoundError("Columbary id={0} not found".format(c_id))

    # TODO get from constant
    columbary.status = 'occupied'

    # Prepare Data
    deceased = Deceased.from_dict(data)
    db.session.add(deceased)
    db.session.commit()

    deceased_occupancy = DeceasedOccupancy(deceased_id=deceased.id, ref_id=columbary.id, ref_table='columbary')
    db.session.add(deceased_occupancy)

    db.session.commit()

    return deceased
