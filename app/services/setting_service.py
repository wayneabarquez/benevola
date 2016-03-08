from app.home.models import LotPrice, Settings
from app import db
import logging

log = logging.getLogger(__name__)


def create_from_dict(data):
    # Prepare Data
    lotprice = LotPrice.from_dict(data)
    # Persist
    db.session.add(lotprice)
    db.session.commit()

    settings = Settings.query.first()

    print "updating settings: {0}".format(settings)

    if settings is not None:
        settings.lot_price_id = lotprice.id
    else:
        settings = Settings(lot_price_id=lotprice.id)
        db.session.add(settings)

    db.session.commit()

    return lotprice


def update_settings(data):
    # Prepare Data
    settings = create_from_dict(data)

    return settings


def get_current_settings():
    settings = Settings.query.first()

    if settings is not None:
        return LotPrice.query.get(settings.lot_price_id)

    return None

