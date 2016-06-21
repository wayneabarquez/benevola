from flask.ext.restful import fields
from app.utils.gis_json_fields import PolygonToLatLng
from app.fields.block_fields import block_fields, block_simple_fields
from copy import copy

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

section_fields = dict(
    id=fields.Integer,
    name=fields.String,
    area=PolygonToLatLng(attribute='area'),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

section_create_fields = dict(
    status=fields.String,
    message=fields.String,
    section=fields.Nested(section_fields, allow_null=False)
)

section_complete_fields = copy(section_fields)
section_complete_fields['blocks'] = fields.Nested(block_fields)

section_basic_fields = copy(section_fields)
section_basic_fields['blocks'] = fields.Nested(block_simple_fields)
