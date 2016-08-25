from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.client_fields import client_fields
from app.fields.lot_fields import lot_create_fields
from app import rest_api
from app.services import client_service, lot_service
from app.exceptions.lot import LotNotFoundError
# from app.exceptions.client import SectionNotFoundError
# from app.home.forms import AddClientForm
# from flask_login import current_user
import logging

log = logging.getLogger(__name__)


class ClientsResource(Resource):
    """
    Resource for Block
    """

    @marshal_with(client_fields)
    def get(self):
        """ GET /api/clients """
        # TODO check authenticated user
        # TODO: Handle logins for 401s
        clients = client_service.get_clients()
        log.debug("Clients Resource Data: {0}".format(clients))
        return clients


class LotClientResource(Resource):
    def put(self, lot_id):
        """ PUT /api/lots/<lot_id>/client """
        form_data = request.json
        log.debug('Update Lot Client request id={0} {1}'.format(lot_id, form_data))
        try:
            # client = client_service.create_from_dict(form_data)
            # Update Lot here
            lot = lot_service.update_lot_client(lot_id, form_data)

            result = dict(status=200, message='OK', lot=lot)

            return marshal(result, lot_create_fields)
        except LotNotFoundError as err:
            abort(403, message=err.message)


rest_api.add_resource(ClientsResource, '/api/clients')
rest_api.add_resource(LotClientResource, '/api/lots/<int:lot_id>/client')
