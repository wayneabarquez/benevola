from .models import Section
from wtforms_alchemy import ModelForm
from flask_wtf import Form
from wtforms.fields import SelectField, StringField, TextAreaField
from wtforms import validators

class AddSectionForm(ModelForm):
    class Meta:
        model = Section
        exclude = ['area']

    name = StringField(u'Section Name', [validators.required(), validators.length(min=3)])

    def __init__(self, *args, **kwargs):
        super(AddSectionForm, self).__init__(*args, **kwargs)

    def validate(self):
        form_data = self.data
        is_valid_data = True

        rv = ModelForm.validate(self)
        if not rv:
            is_valid_data = False

        # TODO: Validate Area here
        # if form_data['coordinates'] is None:
        #     self.coordinates.errors.append('Coordinates is Required')
        #     is_valid_data = False

        return is_valid_data
