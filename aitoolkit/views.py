import re
import json
import random
import string
from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery

import sys

# use react as front-end
views = Blueprint('views', __name__)


@views.route('/', methods=['GET'])
def index():	
    return render_template("index.html")


#error page
# @ml_views.app_errorhandler(404)
# def page_not_found(e):
#     return render_template('404.html'), 404

# @ml_views.app_errorhandler(400)
# def bad_request(e):
#     return render_template('400.html'), 400
