import os

import config
from flask import Flask, url_for, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import jinja2

import pyrebase
import redis
from rq import Queue

#from aitoolkit.ml_api import load_model_remote

#setup firebase
firebase = pyrebase.initialize_app(config.FIREBASE_CONFIG)
auth = firebase.auth()
#setup Redis Queue

ml_models = {}
#ml_models["fasterRCNN_I"] = load_model_remote(config.IMAGE_CLASSIFITER_MODELS["FasterRCNN_Inceptionv2"])

conn = redis.from_url(config.REDIS_URL)
db = SQLAlchemy()

class ReverseProxied(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        scheme = environ.get('HTTP_X_FORWARDED_PROTO')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)

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
    app.wsgi_app = ReverseProxied(app.wsgi_app) #for proxied

    # for disalbe warning about AVX2
    # os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    
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
    from aitoolkit.views import views
    from aitoolkit.api import api
    app.register_blueprint(views)
    app.register_blueprint(api)

    #load ml model_st
    #from aitoolkit.ml_api import load_model_remote
    # ml_models["mobilenet"] = load_model(config.IMAGE_CLASSIFITER_MODELS["SSD_MobileNet_V2"])
    #ml_models["fasterRCNN_R"] = load_model(config.IMAGE_CLASSIFITER_MODELS["FasterRCNN_ResNet"])
    #ml_models["maskRCNN"] = load_model(config.IMAGE_CLASSIFITER_MODELS["Mask_RCNN"])

    #q = Queue('ml-task', connection=conn)
    #app.redis = conn
    #app.task_queue = q

    db.app = app
    db.init_app(app)

    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()
        
    return app

