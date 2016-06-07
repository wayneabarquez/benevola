from .models import Section, Block, Lot, Client, Deceased
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

    name = StringField(validators=[validators.required()])
    block_id = StringField(validators=[validators.required()])
    area = TextAreaField(validators=[validators.required()])
    dimension = StringField(validators=[validators.required()])


class AddClientForm(ModelForm):
    class Meta:
        model = Client

    first_name = StringField(validators=[validators.required()])
    last_name = StringField(validators=[validators.required()])


class AddDeceasedForm(ModelForm):
    class Meta:
        model = Deceased

    first_name = StringField(validators=[validators.required()])
    last_name = StringField(validators=[validators.required()])
    date_of_birth = StringField(validators=[validators.required()])
    date_of_death = StringField(validators=[validators.required()])

