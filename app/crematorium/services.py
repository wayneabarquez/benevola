from app import db
from app.home.models import Deceased
from .models import Crematorium, FuneralHomes
import logging

log = logging.getLogger(__name__)


def get_cremations():
    return Crematorium.query.all()


def create_from_dict(data):
    funeral_home = None

    if 'funeral_homes' in data:
        funeral_home = FuneralHomes.from_dict(data['funeral_homes'])
        db.session.add(funeral_home)

    # if 'deceased' in data:
    deceased_data = data['deceased']
    deceased = Deceased(first_name=deceased_data['first_name'], last_name=deceased_data['last_name'],
                        middle_name=deceased_data['middle_name'], gender=deceased_data['gender'],
                        date_of_birth=deceased_data['date_of_birth'], date_of_death=deceased_data['date_of_death'])
    db.session.add(deceased)

    db.session.commit()

    # Prepare Data
    cremation = Crematorium(deceased_id=deceased.id, date_cremated=data['date_cremated'],
                            time_started=data['time_started'], time_finished=data['time_finished'],
                            gas_consumed=data['gas_consumed'])

    if funeral_home is not None:
        cremation.funeral_home_id = funeral_home.id

    # Persist
    db.session.add(cremation)
    db.session.commit()

    return cremation


def get_cremation_list_by_date (start_date, end_date):
    return Crematorium.query.filter(Crematorium.date_cremated.between(start_date, end_date)).order_by(Crematorium.date_cremated)


def get_cremation_by_date(start_date, end_date):
    list = []
    result = get_cremation_list_by_date(start_date, end_date)
    for item in result:
        item.label = 'Cremation'
        list.append(item)
    return list
