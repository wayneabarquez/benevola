from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand
from app import app
from app.home.models import *
from app.authentication.models import *
from app.columbary.models import *
from app.crematorium.models import Crematorium
from app.data.sample_data import *

manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    db.create_all()
    print "Initialized the Database"


@manager.command
def dropdb():
    if prompt_bool("Are you sure you want to Drop your Database?"):
        db.drop_all()
        print "Database Dropped"


@manager.command
def create_users():
    SampleData.load_users()


@manager.command
def create_columbary():
    SampleData.load_columbary()


if __name__ == '__main__':
    manager.run()
