import os

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'benevola-2016'
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = 'benevola-2016'
    LOG_FILENAME = '/var/www/benevola/logs/app.log'
    STATIC_FOLDER = '/var/www/benevola/client/static'
    TEMPLATES_FOLDER = '/var/www/benevola/client/templates'
    TMP_DIR = '/var/www/benevola/tmp'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://benevolauser:youcantguess@localhost:5432/benevola'


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    pass


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)