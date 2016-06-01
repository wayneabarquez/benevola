from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.block_fields import *
from app import rest_api
from app.services import block_service
from app.exceptions.section import SectionNotFoundError
from app.home.forms import AddBlockForm
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class BlocksResource(Resource):
    """
    Resource for Block
    """

    @marshal_with(block_fields)
    def get(self):
        """ GET /api/blocks """
        # TODO check authenticated user
        # TODO: Handle logins for 401s
        # try:
        # solars = solar_service.get_solars_for_user(current_user)
        # log.debug("Scips Resource Data: {0}".format(scips))
        # return solars
        # except scip_service.UserNotAuthorizedError:
        # abort(401, message="Requires user to login")
        # except scip_service.UserRoleInvalidError as err:
        #     abort(403, message=err.message)
        blocks = block_service.get_blocks()
        log.debug("Blocks Resource Data: {0}".format(blocks))
        return blocks


class SectionBlocksResource(Resource):
    """
    Resource for Section Blocks
    """

    @marshal_with(block_basic_fields)
    def get(self, section_id):
        """ GET /api/sections/section_id/blocks """
        log.debug("Get All Blocks for Section : {0}".format(section_id))
        try:
            return block_service.get_blocks_for_section(section_id)
        except SectionNotFoundError as err:
            abort(403, message=err.message)

    def post(self, section_id):
        """ POST /api/sections/<section_id>/blocks """
        form_data = request.json
        log.debug('Add Block for Section id={0} request: {1}'.format(section_id, form_data))
        # TODO check authenticated user
        form = AddBlockForm.from_json(form_data)
        if form.validate():
            block = block_service.create_from_dict(section_id, form_data)
            result = dict(status=200, message='OK', block=block)
            return marshal(result, block_create_fields)
        else:
            abort(400, message="Invalid Parameters", errors=form.errors)


rest_api.add_resource(BlocksResource, '/api/blocks')
rest_api.add_resource(SectionBlocksResource, '/api/sections/<int:section_id>/blocks')
