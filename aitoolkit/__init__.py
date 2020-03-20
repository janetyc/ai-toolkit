import os

import config
from flask import Flask, url_for, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import jinja2

db = SQLAlchemy()


# why we use application factories
# http://flask.pocoo.org/docs/1.0/patterns/appfactories/#app-factories
def create_app():
    
    # use react app build folder
    # default use react as templated folder
    app = Flask(__name__, template_folder='static/build', static_folder='static')
    # app = Flask(__name__)

    CORS(app)
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

    # https://www.twblogs.net/a/5c6fb7babd9eee7f92eb9b94
    @app.before_request
    def before_request():
        if request.blueprint is not None:
            bp = app.blueprints[request.blueprint]            
            if bp.jinja_loader is not None:
                newsearchpath = bp.jinja_loader.searchpath + app.jinja_loader.searchpath
                app.jinja_loader.searchpath = newsearchpath
                print("new: %s" % newsearchpath)
        #以下爲2016-03-11日更新：
        #如果訪問非藍圖模塊或藍圖中沒有指定template_folder,默認使用app註冊時指定的全局template_floder.
            else:
                app.jinja_loader.searchpath = app.jinja_loader.searchpath[-1:]
                print("no")
        else:
            app.jinja_loader.searchpath = app.jinja_loader.searchpath[-1:]
        
        print("final search path: %s" % app.jinja_loader.searchpath)


    #import and register blueprints
    #should put after app
    #(why blueprints? http://flask.pocoo.org/docs/1.0/blueprints/)
    # from aitoolkit.views import views
    # from aitoolkit.test_views import test_views
    # app.register_blueprint(views)
    # app.register_blueprint(test_views)
    from aitoolkit.main.views import views
    from aitoolkit.admin.admin_views import admin_views
    from aitoolkit.mlapp.ml_views import ml_views

    app.register_blueprint(views)
    app.register_blueprint(admin_views)
    app.register_blueprint(ml_views)

    db.app = app
    db.init_app(app)




    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()

    return app


