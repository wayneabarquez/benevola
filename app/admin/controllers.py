from . import admin
from flask import render_template
import logging

log = logging.getLogger(__name__)

@admin.route('/admin', methods=['GET'])
def index():
    return render_template('/admin.html')
