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


class LotsResource(Resource):
    """
    Resource for Lots
    """

    @marshal_with(lot_complete_fields)
    def get(self):
        # TODO check authenticated user
        return lot_service.get_lots()


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
            lot = lot_service.sold_lot(lot_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)

    def delete(self, lot_id):
        """ DELETE /api/lots/<lot_id> """
        log.debug('Delete Lot request id = {0}'.format(lot_id))
        # TODO check authenticated user
        try:
            lot_service.delete_lot(lot_id)
            result = dict(status=200, message='OK')
            return marshal(result, ok_response)
        except LotNotFoundError as err:
            abort(404, message=err.message)


class LotDimensionResource(Resource):
    """
    Resource for Lot Dimension
    """

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/dimension """
        form_data = request.json
        log.debug('Update Lot Dimension request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.update_lot_dimension(lot_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)


class LotPriceResource(Resource):

    """
    Resource for Lot Price
    """

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/price """
        form_data = request.json
        log.debug('Update Lot Price request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.update_lot_price(lot_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)


class LotORNoResource(Resource):
    """
    Resource for Lot OR No
    """

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/or_no """
        form_data = request.json
        log.debug('Update Lot OR No request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.update_lot_or_no(lot_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)


class LotRemarksResource(Resource):
    """
    Resource for Lot Remarks
    """

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/remarks """
        form_data = request.json
        log.debug('Update Lot remarks request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.update_remarks(lot_id, form_data)
            result = dict(status=200, message='OK', lot=lot)
            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(404, message=err.message)


class LotNameResource(Resource):
    """
    Resource for Lot Name
    """

    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/name """
        form_data = request.json
        log.debug('Update Lot name request id {0}: {1}'.format(lot_id, form_data))
        # TODO check authenticated user
        try:
            lot = lot_service.update_name(lot_id, form_data)
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


rest_api.add_resource(LotsResource, '/api/lots')
rest_api.add_resource(LotDetailResource, '/api/lots/<int:lot_id>')
rest_api.add_resource(LotDimensionResource, '/api/lots/<int:lot_id>/dimension')
rest_api.add_resource(LotPriceResource, '/api/lots/<int:lot_id>/price')
rest_api.add_resource(LotORNoResource, '/api/lots/<int:lot_id>/or_no')
rest_api.add_resource(LotRemarksResource, '/api/lots/<int:lot_id>/remarks')
rest_api.add_resource(BlockLotResource, '/api/blocks/<int:block_id>/lots')
rest_api.add_resource(LotDeceasedResource, '/api/lots/<int:lot_id>/deceased')
rest_api.add_resource(LotNameResource, '/api/lots/<int:lot_id>/name')

