from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand
from app import app
from app.home.models import *
from app.authentication.models import *

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
def create_roles():
    # Admin Role
    admin_role = Role()
    admin_role.name = RoleType.ADMIN
    db.session.add(admin_role)
    # User Role
    user_role = Role()
    user_role.name = RoleType.USER
    db.session.add(user_role)
    db.session.commit()
    print "Roles Created"


@manager.command
def create_users():
    u = User()
    u.username = 'user1'
    u.password = 'password123'
    u.role_id = 2
    db.session.add(u)
    db.session.commit()
    print "Created User"


@manager.command
def create_admin_user():
    u = User()
    u.username = 'admin'
    u.password = 'password123'
    u.role_id = 1
    db.session.add(u)
    db.session.commit()
    print "Created Admin"


if __name__ == '__main__':
    manager.run()
