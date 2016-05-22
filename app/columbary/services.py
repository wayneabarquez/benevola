from app.columbary.models import *
from .exceptions import ColumbaryNotFoundError
from app import db

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

    # data['deceased'] = columbary.get_deceased()
    log.debug("Columbary Details: {0}".format(data))

    return data


def update_columbary(c_id, data):
    columbary = Columbary.query.get(c_id)

    if columbary is None:
        raise ColumbaryNotFoundError("Lot {0} not found".format(c_id))

    columbary.update_from_dict(data, ['id', 'client'])
    db.session.commit()
    return columbary
