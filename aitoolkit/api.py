import json
import os

from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify
from aitoolkit.dbquery import DBQuery
from aitoolkit import firebase

from datetime import datetime
from base64 import b64decode


api = Blueprint('api', __name__)
storage = firebase.storage()

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

@api.route('/api/add_images', methods=('GET', 'POST'))
def add_images():
    if request.method == 'POST':
        json_data = request.get_json()
        image_list = []
        for item in json_data:
            img_id = item
            header, encoded = json_data[item].split(",", 1)
            idata = b64decode(encoded)
        
            with open("temp/%s.jpg" % img_id, "wb") as f:
                f.write(idata)
        
            storage.child('/images/%s.jpg' % img_id).put("temp/%s.jpg" % img_id)    
            url = storage.child('/images/%s.jpg' % img_id).get_url(None)
            image_list.append(
                {
                    "id": img_id,
                    "url": url
                }
            )
            os.remove("temp/%s.jpg" % img_id)
        data = {
            "images": image_list
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
    