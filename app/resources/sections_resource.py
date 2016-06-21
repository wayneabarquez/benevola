from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app.fields.section_fields import *
from app import rest_api
from app.services import section_service
from app.exceptions.section import SectionNotFoundError
from app.home.forms import AddSectionForm
import logging

log = logging.getLogger(__name__)


class SectionsResource(Resource):
    """
    Resource for Section
    """

    @marshal_with(section_complete_fields)
    def get(self):
        """ GET /api/sections """
        # TODO check authenticated user
        # TODO: Handle logins for 401s
        sections = section_service.get_sections()
        log.debug("Sections Resource Data: {0}".format(sections))
        return sections

    def post(self):
        """ POST /api/sections """
        form_data = request.json
        log.debug('Add Section request: {0}'.format(form_data))
        # TODO check authenticated user
        form = AddSectionForm.from_json(form_data)
        if form.validate():
            section = section_service.create_from_dict(form_data)
            result = dict(status=200, message='OK', section=section)
            return marshal(result, section_create_fields)
        else:
            abort(400, message="Invalid Parameters", errors=form.errors)


class SectionsBasicResource(Resource):
    """
    Resource for Section Basic Fields
    """

    @marshal_with(section_basic_fields)
    def get(self):
        """ GET /api/sections """
        # TODO check authenticated user
        # TODO: Handle logins for 401s
        sections = section_service.get_sections()
        log.debug("Sections Basic Resource Data: {0}".format(sections))
        return sections


class SectionDetailResource(Resource):
    """
    Resource for Section Detail
    """

    @marshal_with(section_complete_fields)
    def get(self, section_id):
        log.debug('GET Section request id={0}: {1}'.format(section_id, request.json))
        # TODO check authenticated user
        # if current_user and current_user.is_authenticated:
        section = section_service.get_section(section_id)
        if section:
            data = section.to_dict()
            data['blocks'] = section.get_blocks()
            return data
        abort(404, message="Section id={0} not found".format(section_id))
        # abort(401, message="Requires user to login")

    def put(self, section_id):
        """ PUT /api/sections/<section_id> """
        form_data = request.json
        log.debug('Update Section request id {0}: {1}'.format(section_id, form_data))
        # TODO check authenticated user
        form = AddSectionForm.from_json(form_data)
        if form.validate():
            try:
                section = section_service.update_from_dict(section_id, form_data)
                result = dict(status=200, message='OK', section=section)
                return marshal(result, section_create_fields)
            except SectionNotFoundError as err:
                abort(404, message=err.message)
        else:
            abort(400, message="Invalid Parameters", errors=form.errors)


rest_api.add_resource(SectionsResource, '/api/sections')
rest_api.add_resource(SectionsBasicResource, '/api/sections/basic')
rest_api.add_resource(SectionDetailResource, '/api/sections/<int:section_id>')
