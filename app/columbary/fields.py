from flask.ext.restful import fields
from app.fields.client_fields import client_fields
from app.fields.deceased_fields import deceased_fields
from copy import copy

columbary_fields = dict(
    id=fields.Integer,
    c_no=fields.Integer,
    block=fields.String,
    price=fields.Float,
    or_no=fields.String,
    date_purchased=fields.DateTime("iso8601"),
    status=fields.String,
    remarks=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

columbary_create_fields = dict(
    status=fields.String,
    message=fields.String,
    columbary=fields.Nested(columbary_fields, allow_null=False)
)

page_fields = dict(
    first_url=fields.String,
    last_url=fields.String,
    next_url=fields.String,
    page=fields.Integer,
    pages=fields.Integer,
    per_page=fields.Integer,
    prev_url=fields.String,
    prev_page=fields.String,
    next_page=fields.String,
    total=fields.Integer
)

columbary_paginated_fields = dict(
    columbary=fields.List(fields.Nested(columbary_fields)),
    pages=fields.Nested(page_fields, allow_null=False)
)

columbary_complete_fields = copy(columbary_fields)
columbary_complete_fields['deceased'] = fields.Nested(deceased_fields)
columbary_complete_fields['client'] = fields.Nested(client_fields)
columbary_complete_fields['client_name'] = fields.String
