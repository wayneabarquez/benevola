from flask.ext.restful import fields, Resource, abort, marshal, marshal_with
from flask import request
from app import rest_api
from app.services import setting_service
import logging

log = logging.getLogger(__name__)

settings_fields = dict(
    id=fields.Integer,
    price_per_sq_mtr=fields.Float,
    date_price_effective=fields.DateTime("iso8601"),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

success_settings_fields = dict(
    status=fields.String,
    message=fields.String,
    settings=fields.Nested(settings_fields, allow_null=False)
)


class SettingsResource(Resource):
    """
    Resource for Block
    """

    def post(self):
        """ POST /api/settings """
        form_data = request.json
        log.debug('Update Settings request: {0}'.format(form_data))
        settings = setting_service.update_settings(form_data)
        result = dict(status=200, message='OK', settings=settings)
        log.debug("Result: {0}".format(result))
        return marshal(result, success_settings_fields)


class LastLotPriceResource(Resource):
    """
    Resource for LastLotPrice
    """

    @marshal_with(settings_fields)
    def get(self):
        """ GET /api/settings/last_lot_price """
        last_lot = setting_service.get_current_settings()
        return last_lot


rest_api.add_resource(SettingsResource, '/api/settings')
rest_api.add_resource(LastLotPriceResource, '/api/settings/last_lot_price')
