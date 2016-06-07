from app import db
from app.home.models import Deceased
from app.crematorium.models import Crematorium
import logging

log = logging.getLogger(__name__)


def get_cremations():
    return Crematorium.query.all()


def create_from_dict(data):
    dec = Deceased.from_dict(data)
    db.session.add(dec)
    db.session.commit()

    # Prepare Data
    crem = Crematorium.from_dict(data)
    crem.deceased_id = dec.id
    # Persist
    db.session.add(crem)
    db.session.commit()

    return crem