from flask import Blueprint

columbary = Blueprint('columbary', __name__)

from . import resources
