import os

import config
from flask import Flask, url_for, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import jinja2

import pyrebase

db = SQLAlchemy()

#setup firebase
firebase = pyrebase.initialize_app(config.FIREBASE_CONFIG)

# why we use application factories
# http://flask.pocoo.org/docs/1.0/patterns/appfactories/#app-factories
def create_app():
    
    # use react app build folder
    # default use react as templated folder
    app = Flask(__name__, 
                template_folder='static/build', 
                static_folder='static/build/static')
    
    
    # app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
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
    #(why blueprints? http://flask.pocoo.org/docs/1.0/blueprints/)
    # from aitoolkit.views import views
    # from aitoolkit.test_views import test_views
    # app.register_blueprint(views)
    # app.register_blueprint(test_views)
    from aitoolkit.views import views
    from aitoolkit.api import api
    app.register_blueprint(views)
    app.register_blueprint(api)

    db.app = app
    db.init_app(app)


    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()

    return app


