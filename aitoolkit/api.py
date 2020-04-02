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
        project_id = json_data["project_id"]
        image_data = json_data["data"]
        
        image_list = []
        for img_key in image_data:
            header, encoded = image_data[img_key].split(",", 1)
            idata = b64decode(encoded)
        
            with open("temp/%s.jpg" % img_key, "wb") as f:
                f.write(idata)
        
            storage.child('/images/%s.jpg' % img_key).put("temp/%s.jpg" % img_key)
            url = storage.child('/images/%s.jpg' % img_key).get_url(None)
            
            os.remove("temp/%s.jpg" % img_key)

            # save to image database
            img_id = DBQuery().add_image(int(project_id), url, img_key)

            image_list.append(
                {
                    "key": img_key,
                    "id": img_id,
                    "url": url
                }
            )

        old_list = DBQuery().get_image_list_by_project_id(int(project_id))
        if old_list:
            old_list.extend(image_list)
        else:
            old_list = []
        
        DBQuery().update_image_list_by_project_id(project_id, old_list)

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
            "id": project.id,
            "title": project.title,
            "description": project.description
        })


    data = {
        "all_projects": projects
    }
    return jsonify(data)

@api.route('/api/get_project_by_id', methods=('GET', 'POST'))
def get_project_by_id():
    if request.method == 'POST':
        data = request.get_json()
        project_id = data["project_id"]

        image_data = []
        if is_number(project_id):
            project = DBQuery().get_project_by_id(int(project_id))
            image_data = DBQuery().get_images_by_project_id(int(project_id))

            data = {
                "id": project.id,
                "title": project.title,
                "description": project.description,
            }
    
        else:
            data = {}

        return jsonify(success=1, data=data, image_data=image_data)
    else:
        return jsonify(success=0, data=[], image_data=[])


def is_number(s):
    """ Returns True is string is a number. """
    return s.replace('.','',1).isdigit()
    