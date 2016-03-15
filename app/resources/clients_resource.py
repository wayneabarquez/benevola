from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app.fields.client_fields import client_fields
from app.fields.lot_fields import lot_client_create_fields
from app import rest_api
from app.services import client_service, lot_service
# from app.exceptions.client import SectionNotFoundError
from app.home.forms import AddClientForm
from flask_login import current_user
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

    def post(self):
        """ POST /api/clients """
        form_data = request.json
        log.debug('Add Client for lot request: {0}'.format(form_data))
        # TODO check authenticated user
        form = AddClientForm.from_json(form_data)
        try:
            if form.validate():
                client = client_service.create_from_dict(form_data)

                # Update Lot here
                lot = lot_service.sold_lot(form_data['lot_id'], client.id)

                result = dict(status=200, message='OK', client=client, lot=lot)

                return marshal(result, lot_client_create_fields)
            else:
                abort(400, message="Invalid Parameters", errors=form.errors)
        except ValueError as err:
            abort(403, message=err.message)


rest_api.add_resource(ClientsResource, '/api/clients')
