from app import db
from app.home.models import Deceased
from .models import Crematorium
import logging

log = logging.getLogger(__name__)


def get_cremations():
    return Crematorium.query.all()


def create_from_dict(data):
    deceased_data = data['deceased']
    deceased = Deceased(first_name=deceased_data['first_name'], last_name=deceased_data['last_name'],
                        middle_name=deceased_data['middle_name'], gender=deceased_data['gender'],
                        date_of_birth=deceased_data['date_of_birth'], date_of_death=deceased_data['date_of_death'])
    db.session.add(deceased)
    db.session.commit()

    if deceased is not None:
        print "deceased: {0}".format(deceased)

        # Prepare Data
        cremation = Crematorium(deceased_id=deceased.id, date_cremated=data['date_cremated'],
                                time_started=data['time_started'], time_finished=data['time_finished'],
                                gas_consumed=data['gas_consumed'])
        # Persist
        db.session.add(cremation)
        db.session.commit()

        return cremation

    return None
