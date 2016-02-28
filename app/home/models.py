from app import db
from app.models import BaseModel
from geoalchemy2 import Geometry


class Section(BaseModel):
    name = db.Column(db.String(50), nullable=False)
    area = db.Column(Geometry('POLYGON'))

#     def get_panels_data(self):
#         panels = []
#         for panel in self.panels:
#             panels.append(panel.to_dict())
#         return panels
#
#     def get_photos_data(self):
#         photos = []
#         for photo in self.files:
#             photo_dict = photo.to_dict()
#             photo_dict['src'] = photo.get_url()
#             photos.append(photo_dict)
#         return photos
#
#
# class SolarPanels(BaseModel):
#     solar_id = db.Column(db.Integer, db.ForeignKey('solar.id'), nullable=False)
#     name = db.Column(db.String(50), nullable=False)
#     area = db.Column(Geometry('POLYGON'), nullable=False)
#     size = db.Column(db.String(100))
#     solar = db.relationship(Solar, backref='panels')
#
#
# class SolarFile(BaseModel):
#     solar_id = db.Column(db.Integer, db.ForeignKey('solar.id'), nullable=False)
#     caption = db.Column(db.Text)
#     file_name = db.Column(db.Text, nullable=False)
#     type = db.Column(db.Text, nullable=False)
#     solar = db.relationship(Solar, backref='files')
#
#     def __init__(self, *args, **kwargs):
#         super(SolarFile, self).__init__(*args, **kwargs)
#         self.src = self.get_url()
#         print '__init__ is called from solarfile'
#
#     # def __get__(self, instance, owner):
#     # print '__get__ from solarFile called'
#     #     if instance is None:
#     #         return None
#     #
#     #     instance.src = self.get_url()
#     #     return super(SolarFile, self).__get__(instance, owner)
#
#     def get_url(self):
#         return url_for('static', _external=True, filename='uploads/' + self.file_name)
