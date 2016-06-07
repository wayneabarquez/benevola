from flask import Blueprint

crematorium = Blueprint('crematorium', __name__)

from . import resources
