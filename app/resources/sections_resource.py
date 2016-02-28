from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app.fields.section_fields import *
from app import app, rest_api
from app.services import section_service
from app.exceptions.section import SectionNotFoundError
from app.home.forms import AddSectionForm
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class SectionsResource(Resource):
    """
    Resource for Section
    """

    # @marshal_with(section_fields)
    # def get(self):
    #     """ GET /sections """
        # TODO check authenticated user
        # TODO: Handle logins for 401s and get_solars_for_user
        # try:
        # solars = solar_service.get_solars_for_user(current_user)
        # log.debug("Scips Resource Data: {0}".format(scips))
        # return solars
        # except scip_service.UserNotAuthorizedError:
        # abort(401, message="Requires user to login")
        # except scip_service.UserRoleInvalidError as err:
        # abort(403, message=err.message)
        # return solar_service.get_solars_for_user()

    def post(self):
        form_data = request.json
        log.debug('Add Section request: {0}'.format(form_data))
        # TODO check authenticated user
        # Validation here
        # form = AddSectionForm.from_json(form_data)
        # if form.validate():
        #     model_obj = section_service.create_from_dict(form_data)
        #     result = dict(status=200, message='OK', section=model_obj)
        #     return marshal(result, section_create_fields)
        # else:
        #     abort(400, message="Invalid Parameters", errors=form.errors)

rest_api.add_resource(SectionsResource, '/api/sections')
