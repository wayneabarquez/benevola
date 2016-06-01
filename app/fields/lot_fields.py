from flask.ext.restful import fields
from app.utils.gis_json_fields import PolygonToLatLng
from app.fields.deceased_fields import deceased_fields
from app.fields.client_fields import client_fields

from copy import copy

section_basic_fields = dict(
    id=fields.Integer,
    name=fields.String,
    area=PolygonToLatLng(attribute='area'),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

block_basic_fields = dict(
    id=fields.Integer,
    section_id=fields.Integer,
    name=fields.String,
    area=PolygonToLatLng(attribute='area'),
    section=fields.Nested(section_basic_fields)
)

lot_fields = dict(
    id=fields.Integer,
    block_id=fields.Integer,
    client_id=fields.Integer,
    block=fields.Nested(block_basic_fields),
    name=fields.String,
    area=PolygonToLatLng(attribute='area'),
    dimension=fields.String,
    lot_area=fields.Float,
    price_per_sq_mtr=fields.Float,
    amount=fields.Float,
    or_no=fields.String,
    date_purchased=fields.DateTime("iso8601"),
    status=fields.String,
    remarks=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

lot_create_fields = dict(
    status=fields.String,
    message=fields.String,
    lot=fields.Nested(lot_fields, allow_null=False)
)

ok_response = dict(
    status=fields.String,
    message=fields.String
)

lot_client_create_fields = dict(
    status=fields.String,
    message=fields.String,
    client=fields.Nested(client_fields),
    lot=fields.Nested(lot_fields),
)

lot_complete_fields = copy(lot_fields)
lot_complete_fields['deceased'] = fields.Nested(deceased_fields)
lot_complete_fields['client'] = fields.Nested(client_fields)



# lot_complete_fields['block'] = fields.Nested(block_basic_fields)
