from .models import Crematorium
from wtforms_alchemy import ModelForm
from wtforms.fields import StringField, TextAreaField, IntegerField
from wtforms import validators


class AddCremationForm(ModelForm):
    class Meta:
        model = Crematorium

    first_name = StringField(validators=[validators.required()])
    last_name = StringField(validators=[validators.required()])
    date_of_birth = StringField(validators=[validators.required()])
    date_of_death = StringField(validators=[validators.required()])
    time_started = StringField(validators=[validators.required()])
    time_finished = StringField(validators=[validators.required()])
    gas_consumed = IntegerField(validators=[validators.required()])
