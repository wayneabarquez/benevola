from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.lot_fields import *
from app.fields.deceased_fields import deceased_create_fields
from app import rest_api
from app.services import lot_service
from app.exceptions.lot import *
from app.home.forms import AddLotForm, AddDeceasedForm
from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class LotDetailResource(Resource):
    """
    Resource for Lot Detail
    """

    @marshal_with(lot_complete_fields)
    def get(self, lot_id):
        log.debug('GET Lot request id={0}: {1}'.format(lot_id, request.json))
        # TODO check authenticated user
        # if current_user and current_user.is_authenticated:
        try:
            return lot_service.get_details(lot_id)
        except LotNotFoundError:
            abort(404, message="Lot id={0} not found".format(lot_id))
        # abort(401, message="Requires user to login")

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id> """
        form_data = request.json
        log.debug('Update Lot request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.sold_lot(lot_id, form_data['client_id'])
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)


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
        try:
            if form.validate():
                lot = lot_service.create_from_dict(block_id, form_data)
                result = dict(status=200, message='OK', lot=lot)
                return marshal(result, lot_create_fields)
            else:
                abort(400, message="Invalid Parameters", errors=form.errors)
        except LotPriceNullError as err:
            abort(403, message=err.message)


class LotDeceasedResource(Resource):
    """
    Resource for Deceased Lots
    """

    def post(self, lot_id):
        """ POST /api/lots/<lot_id>/deceased """
        form_data = request.json
        log.debug('Add Deceased for Lot id={0} request: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        form = AddDeceasedForm.from_json(form_data)
        try:
            if form.validate():
                data = lot_service.add_occupant(lot_id, form_data)
                result = dict(status=200, message='OK', deceased=data)
                return marshal(result, deceased_create_fields)
            else:
                abort(400, message="Invalid Parameters", errors=form.errors)
        except LotPriceNullError as err:
            abort(403, message=err.message)

rest_api.add_resource(LotDetailResource, '/api/lots/<int:lot_id>')
rest_api.add_resource(BlockLotResource, '/api/blocks/<int:block_id>/lots')
rest_api.add_resource(LotDeceasedResource, '/api/lots/<int:lot_id>/deceased')
