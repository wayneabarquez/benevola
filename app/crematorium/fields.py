from flask.ext.restful import fields
from app.fields.deceased_fields import deceased_fields
from copy import copy

funeral_homes_fields = dict(
    id=fields.Integer,
    name=fields.String,
    address=fields.String
)

cremation_fields = dict(
    id=fields.Integer,
    deceased=fields.Nested(deceased_fields),
    funeral_homes=fields.Nested(funeral_homes_fields),
    date_cremated=fields.DateTime("iso8601"),
    time_started=fields.String,
    time_finished=fields.String,
    gas_consumed=fields.Integer,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

cremation_create_fields = dict(
    status=fields.String,
    message=fields.String,
    cremation=fields.Nested(cremation_fields, allow_null=False)
)

cremation_complete_fields = copy(cremation_fields)
