from app import db
from app.authentication.models import *
from app.columbary.models import *


class SampleData:
    @staticmethod
    def refresh_table(table_name):
        db.session.execute('TRUNCATE "' + table_name + '" RESTART IDENTITY CASCADE')
        db.session.commit()

    @staticmethod
    def load_roles():
        SampleData.refresh_table('role')
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

    @staticmethod
    def load_users():
        SampleData.load_roles()

        SampleData.refresh_table('user')
        u = User()
        u.username = 'user1'
        u.password = 'password123'
        u.role_id = 2
        db.session.add(u)
        db.session.commit()
        print "Created User"

        admin = User()
        admin.username = 'admin'
        admin.password = 'password123'
        admin.role_id = 1
        db.session.add(admin)
        db.session.commit()
        print "Created Admin"

    @staticmethod
    def load_columbary():
        SampleData.refresh_table('columbary')

        # Block A
        for x in range(1, 276):
            c = Columbary()
            c.c_no = x
            db.session.add(c)
        # Block B
        for x in range(1, 276):
            c = Columbary()
            c.c_no = x
            c.block = ColumbaryBlockType.B
            db.session.add(c)
        db.session.commit()
