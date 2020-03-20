import json
import string
from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery

import sys

admin_views = Blueprint('admin_views', __name__, url_prefix='/admin', template_folder='templates')

@admin_views.route('/', methods=['GET'])
def test():
    return render_template("displayPDF.html")
