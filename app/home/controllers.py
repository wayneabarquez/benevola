from . import home
from flask import render_template, Response
from app.services import reports_service
import logging

log = logging.getLogger(__name__)


@home.route('/', methods=['GET', 'POST'])
@home.route('/index', methods=['GET', 'POST'])
def index():
    return render_template('/index.html')


@home.route('/reports/lot_list', methods=['GET'])
def generate_lotlist_report():
    file_dict = reports_service.generate_lotlist_report()
    excel_download = open(file_dict['dir'], 'rb').read()

    return Response(
        excel_download,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-disposition": "attachment; filename=" + file_dict['name']}
    )
