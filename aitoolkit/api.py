import json
import os

from flask import Blueprint, Flask, request, render_template, redirect, url_for, jsonify, g
from aitoolkit.dbquery import DBQuery
from aitoolkit import firebase

from datetime import datetime
from base64 import b64decode

from aitoolkit.ml_api import get_predictions_from_url
from aitoolkit import ml_models
from flask import current_app


api = Blueprint('api', __name__)
storage = firebase.storage()
firebase_db = firebase.database()

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

        # update project image_list
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

@api.route('/api/add_objectstory', methods=('GET', 'POST'))
def add_objectstory():
    if request.method == 'POST':
        json_data = request.get_json()
        created_user = json_data["created_user"]
        image_id = json_data["image_id"]
        story = json_data["story"]
        object_list = json_data["object_list"]

        # add story and objects into database
        story_id = DBQuery().add_story_annotation(created_user, int(image_id), story)
        obj_list = []
        for obj in object_list:
            obj_id = DBQuery().add_object_annotation(created_user, image_id, story_id, obj["label"], float(obj["x"]), float(obj["y"]), float(obj["w"]), float(obj["h"]))
            obj_list.append(obj_id)

        DBQuery().update_story_object_list(story_id, obj_list)

        data = {
            "story_id": story_id,
            "object_list": obj_list
        }
        return jsonify(success=1, data=data)
    else:
        return jsonify(success=0, data=[])

@api.route('/api/get_stories_by_image_id', methods=('GET', 'POST'))
def get_stories_by_image_id():
    if request.method == 'POST':
        json_data = request.get_json()
        image_id = json_data["image_id"]
        stories = DBQuery().get_stories_by_image_id(image_id)

        return jsonify(success=1, data=stories)
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

@api.route('/api/get_image_by_id', methods=('GET', 'POST'))
def get_image_by_id():
    if request.method == 'POST':
        data = request.get_json()
        image_id = data["image_id"]
        image = DBQuery().get_image_by_id(int(image_id))
        data = {
            'image_id': image.id,
            'project_id': image.project_id,
            'image_key': image.image_key,
            'image_url': image.image_url,
        }

        return jsonify(success=1, data=data)
    else:
        return jsonify(success=0, data={})

# --------------------- not use ------------------------------- 
@api.route('/api/add_prediction_task', methods=('GET', 'POST'))
def add_prediction_task():
    if request.method == 'POST':
        data = request.get_json()
        image_url = data["image_url"]
        model_name = "fasterRCNN_I"
        
        # add task into queue
        #job = current_app.task_queue.enqueue(run_prediction_task, model_name, image_url)
        #print("push job into queue")

        return jsonify(success=1, data=[])
    else:
        return jsonify(success=0, data=[])

@api.route('/api/get_predictions_by_image_url', methods=('GET', 'POST'))
def get_predictions_by_image_url():
    if request.method == 'POST':
        data = request.get_json()
        
        image_url = data["image_url"]
        image_key = data["image_key"]
        model_name = "fasterRCNN_I"
        results = DBQuery().get_img_predictions_by_key(model_name, image_key)

        if results != None:
            image_size = results["image_size"]
            predictions = results["predictions"]
            data = {
                "image_key": image_key,
                "image_size": image_size,
                "image_url": image_url,
                "predictions": predictions
            }
            
        else: #if no, add prediction into queue
            #get data from firebase
            fire_data = firebase_db.child("predictions").child(image_key).get().val()
            if fire_data:
                data = {
                    "image_size": fire_data["image_size"],
                    "image_url": image_url,
                    "predictions": fire_data["predictions"]
                }
                DBQuery().add_machine_predictions(model_name, image_key, image_url, fire_data)
            else:
                #print("add into task queue")
                #current_app.task_queue.enqueue(run_prediction_task, firebase_db, model_name, image_url, image_key)
                # data = {
                #     "image_size": [0, 0],
                #     "image_url": image_url,
                #     "predictions": []
                # }
                print("nothing happen!!")
        
        return jsonify(success=1, data=data)
    else:
        return jsonify(success=0, data=[])


#run machine prediction and store results to firebase
def run_prediction_task(f_db, model_name, image_url, img_key):
    result = get_predictions_from_url(ml_models[model_name], image_url)
    f_db.child("predictions").child(img_key).set(result)

    print("add task success!")

def is_number(s):
    """ Returns True is string is a number. """
    return s.replace('.','',1).isdigit()
    