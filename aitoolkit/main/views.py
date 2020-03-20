import re
import json
import random
import string
from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery

import sys

#views = Blueprint('views', __name__, template_folder='templates/build', static_folder='templates/build/static')
views = Blueprint('views', __name__,  url_prefix='/', template_folder='templates', static_folder='static')

@views.route('/', methods=['GET'])
def index():
    
    return render_template("main_index.html")

@views.route('/hello', methods=['GET'])
def hello():
    return jsonify([{"msg": "hello",
            "status": 2 } ] )

#error page
@views.app_errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@views.app_errorhandler(400)
def bad_request(e):
    return render_template('400.html'), 400
