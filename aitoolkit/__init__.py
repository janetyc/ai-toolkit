import os

import config
from flask import Flask, url_for, redirect, request
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

# why we use application factories
# http://flask.pocoo.org/docs/1.0/patterns/appfactories/#app-factories
def create_app():

    app = Flask(__name__)
    env = os.getenv('ENV')

    if env == "DEVELOPMENT":
        app.config.from_object('config.DevelopmentConfig')
    elif env == "PRODUCTION":
        app.config.from_object('config.ProductionConfig')
    elif env == "TESTING":
        app.config.from_object('config.TestingConfig')
    elif env == "DEBUG":
        app.config.from_object('config.DebugConfig')
    else:
        app.config.from_object('config.Config')

    #import and register blueprints
    #should put after app    
    from aitoolkit.views import views

    # why blueprints http://flask.pocoo.org/docs/1.0/blueprints/
    app.register_blueprint(views)


    db.app = app
    db.init_app(app)


    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()

    return app


