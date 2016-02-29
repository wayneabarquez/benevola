from .models import Section, Block
from wtforms_alchemy import ModelForm
from wtforms.fields import StringField, TextAreaField
from wtforms import validators


class AddSectionForm(ModelForm):
    class Meta:
        model = Section
        exclude = ['area']

    name = StringField(u'Section Name', [validators.required(), validators.length(min=3)])
    area = TextAreaField(u'Area', [validators.required()])


class AddBlockForm(ModelForm):
    class Meta:
        model = Block
        exclude = ['area']

    name = StringField(u'block Name', [validators.required(), validators.length(min=3)])
    area = TextAreaField(u'Area', [validators.required()])
