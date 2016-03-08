from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.lot_fields import *
from app import rest_api
from app.services import lot_service
from app.home.forms import AddLotForm
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class BlockLotResource(Resource):
    """
    Resource for Block Lots
    """

    def post(self, block_id):
        """ POST /api/blocks/<block_id>/lots """
        form_data = request.json
        log.debug('Add Lot for Block id={0} request: {1}'.format(block_id, form_data))
        # TODO check authenticated user
        form = AddLotForm.from_json(form_data)
        if form.validate():
            lot = lot_service.create_from_dict(block_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        else:
            abort(400, message="Invalid Parameters", errors=form.errors)


rest_api.add_resource(BlockLotResource, '/api/blocks/<int:block_id>/lots')
