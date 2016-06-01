from flask.ext.restful import fields
from app.utils.gis_json_fields import PolygonToLatLng
from app.fields.lot_fields import lot_complete_fields

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

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

lot_complete_fields['block'] = fields.Nested(block_basic_fields)

block_fields = dict(
    id=fields.Integer,
    section_id=fields.Integer,
    name=fields.String,
    area=PolygonToLatLng(attribute='area'),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601"),
    lots=fields.Nested(lot_complete_fields)
)

block_create_fields = dict(
    status=fields.String,
    message=fields.String,
    block=fields.Nested(block_fields, allow_null=False)
)
