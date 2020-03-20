import re
import json
import random
import string
from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery

import sys

#views = Blueprint('views', __name__, template_folder='templates/build', static_folder='templates/build/static')
ml_views = Blueprint('ml_views', __name__,  url_prefix='/ml')

@ml_views.route('/', methods=['GET'])
def index():
    return render_template("index.html")

#error page
# @ml_views.app_errorhandler(404)
# def page_not_found(e):
#     return render_template('404.html'), 404

# @ml_views.app_errorhandler(400)
# def bad_request(e):
#     return render_template('400.html'), 400
