from flask.ext.restful import Resource, abort, marshal, marshal_with
from flask import request
from app import rest_api
from .fields import *
from .services import *
from .exceptions import ColumbaryNotFoundError
from ..decorators import paginate
import logging

log = logging.getLogger(__name__)


class ColumbaryResource(Resource):
    """
    Resource for Columbary
    """

    @marshal_with(columbary_paginated_fields)
    @paginate('columbary', max_per_page=96)
    def get(self):
        return get_columbary(request.args)


class ColumbaryAllResource(Resource):
    """
    Resource for Columbary All
    """

    @marshal_with(columbary_complete_fields)
    def get(self):
        print "Get All Columbary Data Request"
        return get_list()


class ColumbaryDetailResource(Resource):
    """
    Resource for Columbary Detail
    """

    @marshal_with(columbary_complete_fields)
    def get(self, c_id):
        log.debug('GET Columbary request id={0}: {1}'.format(c_id, request.json))
        # TODO check authenticated user
        # if current_user and current_user.is_authenticated:
        try:
            return get_details(c_id)
        except ColumbaryNotFoundError:
            abort(404, message="Columbary id={0} not found".format(c_id))
            # abort(401, message="Requires user to login")

    @marshal_with(columbary_complete_fields)
    def put(self, c_id):
        """ PUT /api/columbary/<c_id> """
        form_data = request.json
        log.debug('Update Columbary request id {0}: {1}'.format(c_id, form_data))
        # TODO check authenticated user
        try:
            return update_columbary(c_id, form_data)
        except ColumbaryNotFoundError as err:
            abort(404, message=err.message)


class MarkSoldColumbaryResource(Resource):
    def put(self, c_id):
        """ PUT /api/columbary/<c_id>/mark_sold """
        form_data = request.json
        log.debug('Mark Sold Columbary request id {0}: {1}'.format(c_id, form_data))
        try:
            columbary = sold_columbary(c_id, form_data)
            result = dict(status=200, message='OK', columbary=columbary)
            return marshal(result, columbary_create_fields)
        except ColumbaryNotFoundError as err:
            abort(404, message=err.message)


rest_api.add_resource(ColumbaryResource, '/api/columbary')
rest_api.add_resource(ColumbaryAllResource, '/api/columbary/all')
rest_api.add_resource(ColumbaryDetailResource, '/api/columbary/<int:c_id>')
rest_api.add_resource(MarkSoldColumbaryResource, '/api/columbary/<int:c_id>/mark_sold')
