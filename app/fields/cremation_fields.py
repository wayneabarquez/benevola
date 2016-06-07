from flask.ext.restful import fields
from app.fields.deceased_fields import deceased_fields
from copy import copy

cremation_fields = dict(
    id=fields.Integer,
    last_name=fields.String,
    middle_name=fields.String,
    gender=fields.String,
    date_of_birth=fields.DateTime("iso8601"),
    age=fields.String,
    address=fields.String,
    deceased=fields.Nested(deceased_fields),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

cremation_create_fields = dict(
    status=fields.String,
    message=fields.String,
    cremation=fields.Nested(cremation_fields, allow_null=False)
)

cremation_complete_fields = copy(cremation_fields)
