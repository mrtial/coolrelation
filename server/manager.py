# need the app and db to initialize migration + command line scripts
from app import app, db  

# this class handels command line script
from flask_script import Manager

from flask_migrate import Migrate, MigrateCommand
# Migrate - handels migration initialization
# MigrateCommand - specifies what command 

# Initialization flask migrate with BOTH the app and our db settings
migrate = Migrate(app, db)

# Initialize flask_script
manager = Manager(app)

# specified what command gets attached to MigrateCommand 
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
	manager.run()  # start our command line script
