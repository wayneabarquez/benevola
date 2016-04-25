from . import home
from flask import render_template, Response, request
from flask_login import login_required
from app.services import reports_service
import logging

log = logging.getLogger(__name__)


@home.route('/', methods=['GET', 'POST'])
@home.route('/index', methods=['GET', 'POST'])
@login_required
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


@home.route('/reports/sales', methods=['GET'])
def generate_sales_report():
    start_date = request.args['start']
    end_date = request.args['end']

    file_dict = reports_service.generate_sales_report(start_date, end_date)

    excel_download = open(file_dict['dir'], 'rb').read()
    return Response(
        excel_download,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-disposition": "attachment; filename=" + file_dict['name']}
    )
