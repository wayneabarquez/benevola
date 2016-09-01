from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.lot_fields import ok_response
from app.fields.deceased_fields import *
from app.exceptions.deceased import *
from app import rest_api
from app.services import deceased_service
import logging

log = logging.getLogger(__name__)


class DeceasedResource(Resource):
    """
    Resource for Deceased
    """

    """ PUT /api/deceased/deceased_id """
    def put(self, deceased_id):
        form_data = request.json
        log.debug("Update Deceased Request id={0} : {1}".format(deceased_id, form_data))
        try:
            deceased = deceased_service.update_deceased(deceased_id, form_data)
            result = dict(status=200, message='OK', deceased=deceased)
            return marshal(result, deceased_create_fields)
        except DeceasedNotFoundError as err:
            abort(403, message=err.message)

    def delete(self, deceased_id):
        """ DELETE /api/deceased/deceased_id """
        try:
            deceased_service.delete_deceased(deceased_id)
            result = dict(status=200, message='OK')
            return marshal(result, ok_response)
        except DeceasedNotFoundError as err:
            abort(403, message=err.message)


rest_api.add_resource(DeceasedResource, '/api/deceased/<int:deceased_id>')
