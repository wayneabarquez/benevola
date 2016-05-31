from flask.ext.restful import fields

deceased_fields = dict(
    id=fields.Integer,
    lot_id=fields.Integer,
    first_name=fields.String,
    last_name=fields.String,
    middle_name=fields.String,
    gender=fields.String,
    date_of_birth=fields.DateTime("iso8601"),
    age=fields.String,
    date_of_death=fields.DateTime("iso8601"),
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

deceased_create_fields = dict(
    status=fields.String,
    message=fields.String,
    deceased=fields.Nested(deceased_fields, allow_null=False)
)
