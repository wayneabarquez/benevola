from app.home.models import Section, Block, Lot
from app.utils import forms_helper
# from app.errors import exceptions
from app.exceptions.section import *
from app import db
import logging

log = logging.getLogger(__name__)


# def get_complete_sections():
#     sections_result = []
#     for section in Section.query.all():
#         # section.blocks = section.get_blocks()
#         # sections_result.append(section)
#         log.debug("Blocks: {0}".format(section.blocks))
#
#     return sections_result


def get_sections():
    return Section.query.all()


def get_section(section_id):
    return Section.query.get(section_id)


def create_from_dict(data):
    # Prepare Data
    section = Section.from_dict(data)
    # Area
    section.area = forms_helper.parse_area(data['area'])
    # Persist
    db.session.add(section)
    db.session.commit()

    return section


def update_from_dict(section_id, data):
    # Prepare Data
    section = Section.query.get(section_id)

    if section is None:
        raise SectionNotFoundError("Section id={0} not found".format(section_id))

    section.update_from_dict(data, ['id', 'area', 'blocks', 'date_modified', 'date_created'])

    # Update Area
    section.area = forms_helper.parse_area(data['area'])

    # Persist
    db.session.commit()

    return section

