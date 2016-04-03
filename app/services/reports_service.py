from openpyxl import Workbook
from openpyxl.cell import Cell
from openpyxl.styles import Style, Font, Alignment
from openpyxl.styles.borders import Border, Side
from app import app
from app.services import section_service
import logging
import datetime

log = logging.getLogger(__name__)

LOT_LIST_FOLDER = app.config['LOT_LIST_REPORTS_FOLDER']
CEMETERY_NAME = app.config['CEMETERY_NAME']
CEMETERY_LOCATION = app.config['CEMETERY_LOCATION']

thin_border = Border(left=Side(style='thin'),
                     right=Side(style='thin'),
                     top=Side(style='thin'),
                     bottom=Side(style='thin'))


def generate_file_name():
    return 'LOT_LIST_' + datetime.datetime.now().strftime('%Y-%m-%d')


def print_worksheet_header(ws):
    # Cemetery Name
    ws.merge_cells('D2:H2')
    ws['D2'].style = Style(font=Font(size=14, bold=True), alignment=Alignment(horizontal="center"))
    ws['D2'] = CEMETERY_NAME

    # Cemetery Location
    ws.merge_cells('D3:H3')
    ws['D3'].style = Style(font=Font(bold=True), alignment=Alignment(horizontal="center"))
    ws['D3'] = CEMETERY_LOCATION


def print_row_spacer(ctr, ws):
    for i in range(ctr):
        ws.append([])


def create_bordered_cell(val, ws, is_bold=False):
    c = Cell(ws, value=val)
    c.font = Font(size=11, bold=is_bold)
    c.border = thin_border
    return c


def print_sections_data(ws):
    sections = section_service.get_sections()

    for section in sections:
        print_row_spacer(2, ws)

        lots = section.get_lots()
        sold_lots = filter(lambda lot: lot['status'] == 'sold', lots)
        unsold_lots = filter(lambda lot: lot['status'] != 'sold', lots)

        # SECTION NAME ROW
        section_name = 'SECTION ' + section.name
        section_name_cell = Cell(ws, column='C', value=section_name)
        section_name_cell.font = Font(size=14, bold=True)
        section_name_cell.border = thin_border
        ws.append([None, None, section_name_cell])

        # NO OF BLOCKS ROW
        no_block_cell = create_bordered_cell('NO. OF BLOCKS', ws, True)
        no_block_value_cell = create_bordered_cell(len(section.blocks), ws)

        ws.append([None, None, no_block_cell, no_block_value_cell])

        # NO OF LOTS ROW
        no_lots_cell = create_bordered_cell('NO. OF LOTS', ws, True)
        no_lots_value_cell = create_bordered_cell(len(lots), ws)
        ws.append([None, None, no_lots_cell, no_lots_value_cell])

        # NO OF SOLD LOTS ROW
        no_sold_lots_cell = create_bordered_cell('SOLD LOTS', ws, True)
        no_sold_lots_value_cell = create_bordered_cell(len(sold_lots), ws)

        ws.append([None, None, no_sold_lots_cell, no_sold_lots_value_cell])

        # NO OF UNSOLD LOTS ROW
        no_unsold_lots_cell = create_bordered_cell('UNSOLD LOTS', ws, True)
        no_unsold_lots_value_cell = create_bordered_cell(len(unsold_lots), ws)

        ws.append([None, None, no_unsold_lots_cell, no_unsold_lots_value_cell])

        ws.append([])
        # Table Header
        table_headers = ['BLOCK', 'LOT NO.', 'DIMENSION', 'AREA', 'PRICE/SM', 'AMOUNT', 'REMARKS', 'OWNER', 'DATE PURCHASED']
        table_header_cells = []
        for h in table_headers:
            c = create_bordered_cell(h, ws, True)
            table_header_cells.append(c)
        r = [''] + table_header_cells
        ws.append(r)

        # TABLE BODY - LOTS
        for b in section.blocks:
            for l in b.lots:
                dimen = str(l.dimension_width) + ' X ' + str(l.dimension_height)
                area = l.dimension_width * l.dimension_height
                price_formatted = '{:20,.2f}'.format(l.price_per_sq_mtr)
                amount = '{:20,.2f}'.format(area * l.price_per_sq_mtr)
                row_val = [b.id, l.id, dimen, area, price_formatted, amount, l.remarks, l.client.get_full_name(),
                           l.date_purchased]
                row_cells = []
                for rv in row_val:
                    row_cells.append(create_bordered_cell(rv, ws))

                ws.append([''] + row_cells)
            # Total of Lots per block
            ws.append([len(b.lots)])

        # print_row_spacer(2, ws)


def generate_lotlist_report():
    wb = Workbook()
    # grab the active worksheet
    ws = wb.active
    ws.column_dimensions['C'].width = 15

    print_worksheet_header(ws)
    print_sections_data(ws)

    filename = generate_file_name() + ".xlsx"
    file_dict = {'name': filename, 'dir': LOT_LIST_FOLDER + filename}

    # Save the file
    wb.save(file_dict['dir'])

    return file_dict
