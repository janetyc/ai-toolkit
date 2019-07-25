from aitoolkit import create_app, db

from flask_script import Manager, prompt_bool
from flask_migrate import Migrate, MigrateCommand

app = create_app()
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def dropdb():
    '''Drops all database tables.'''
    if prompt_bool('Are you sure to drop your databse?'):
        db.drop_all()


if __name__ == '__main__':
    manager.run()
