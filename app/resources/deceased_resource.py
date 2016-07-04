from flask.ext.restful import Resource, abort, marshal, marshal_with
from app.fields.lot_fields import ok_response
from app.exceptions.deceased import *
from app import rest_api
from app.services import deceased_service
import logging

log = logging.getLogger(__name__)


class DeceasedResource(Resource):
    """
    Resource for Deceased
    """

    def delete(self, deceased_id):
        """ GET /api/deceased/deceased_id """
        try:
            deceased_service.delete_deceased(deceased_id)
            result = dict(status=200, message='OK')
            return marshal(result, ok_response)
        except DeceasedNotFoundError as err:
            abort(403, message=err.message)


rest_api.add_resource(DeceasedResource, '/api/deceased/<int:deceased_id>')
