from flask.ext.restful import fields

client_fields = dict(
    id=fields.Integer,
    first_name=fields.String,
    last_name=fields.String,
    middle_name=fields.String,
    gender=fields.String,
    date_of_birth=fields.DateTime("iso8601"),
    age=fields.String,
    address=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

client_create_fields = dict(
    status=fields.String,
    message=fields.String,
    client=fields.Nested(client_fields, allow_null=False)
)
