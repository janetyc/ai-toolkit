import json

from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery
from datetime import datetime

api = Blueprint('api', __name__)


@api.route('/api/add_project', methods=('GET', 'POST'))
def add_project():
    if request.method == 'POST':
        data = request.get_json()
        created_user = data["created_user"]
        title = data["title"]
        description = data["description"]
        
        project_id = DBQuery().add_project(created_user, title, description)

        data = {
            "project_id": project_id,
            "created_user": created_user,
            "title": title,
            "description": description
        }
        return jsonify(success=1, data=data)
    else:
        return jsonify(success=0, data=[])

@api.route('/api/upload_iamges', methods=('GET', 'POST'))
def upload_iamges():
    if request.method == 'POST':
        
        data = {
        }
        return jsonify(success=1, data=data)
    else:
        return jsonify(success=0, data=[])


@api.route('/api/get_all_projects', methods=('GET', 'POST'))
def get_all_projects():
    all_projects = DBQuery().get_all_projects()
    projects = []
    for project in all_projects:
        projects.append({
            "title": project.title,
            "description": project.description
        })

    data = {
        "all_projects": projects
    }
    return jsonify(data)
    