from .models import Section, Block, Lot
from wtforms_alchemy import ModelForm
from wtforms.fields import StringField, TextAreaField, IntegerField
from wtforms import validators


class AddSectionForm(ModelForm):
    class Meta:
        model = Section
        exclude = ['area']

    name = StringField(u'Section Name', [validators.required(), validators.length(min=1)])
    area = TextAreaField(u'Area', [validators.required()])


class AddBlockForm(ModelForm):
    class Meta:
        model = Block
        exclude = ['area']

    name = StringField(u'block Name', [validators.required(), validators.length(min=1)])
    area = TextAreaField(u'Area', [validators.required()])


class AddLotForm(ModelForm):
    class Meta:
        model = Lot
        exclude = ['area']

    block_id = StringField(validators=[validators.required()])
    area = TextAreaField(validators=[validators.required()])
    dimension_width = IntegerField(validators=[validators.required()])
    dimension_height = IntegerField(validators=[validators.required()])
    # lot_area = IntegerField(validators=[validators.required()])
