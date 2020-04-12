import json

from aitoolkit.models import Project
from aitoolkit.models import Image, ImageAnnotation
from aitoolkit.models import ImagePrediction

from aitoolkit.enum import DataType

from aitoolkit import db

class DBQuery(object):
    # ************************************************** #
    #               Add data from database               #
    # ************************************************** #
    def add_project(self, created_user, title, description):
        project = Project(created_user, title, description)
        db.session.add(project)
        db.session.commit()

        return project.id

    def add_image(self, project_id, image_url, image_key):
        image = Image(project_id, image_url, image_key)
        db.session.add(image)
        db.session.commit()

        return image.id

    def add_image_annotation(self, created_user, img_id, label, x, y, w, h):
        image_annotation = ImageAnnotation(created_user, img_id, label, x, y, w, h)
        db.session.add(image_annotation)
        db.session.commit()

        return image_annotation.id

    def add_machine_predictions(self, model_name, image_key, image_url, predictions):
        image_prediction = ImagePrediction(model_name, image_key, image_url, predictions)
        db.session.add(image_prediction)
        db.session.commit()

        return image_prediction.id

    # ************************************************** #
    #               Get data from database               #
    # ************************************************** #
    def get_all_projects(self):
        projects = Project.query.all()
        return projects

    def get_project_by_id(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        return project

    def get_image_by_id(self, image_id):
        image = Image.query.filter_by(id=image_id).first()
        return image

    def get_image_by_key(self, image_key):
        image = Image.query.filter_by(image_key=image_key).first()
        return image

    def get_images_by_project_id(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        all_images = Image.query.filter_by(project_id=project.id).all()
        image_list = []
        for image in all_images:
            image_list.append({
                "id": image.id,
                "key": image.image_key,
                "image_url": image.image_url
            })

        return image_list
        
    def get_image_list_by_project_id(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        return project.image_list

    def get_image_data_by_image_ids(self, image_ids):
        image_data = []
        for img_id in image_ids:
            image = self.get_image_by_id(img_id)
            image_data.append(image)

        return image_data
    
    def get_img_predictions_by_key(self, model_name, image_key):
        predictions = ImagePrediction.query.filter_by(image_key=image_key, model_name=model_name).first()
    
        if predictions:
            output = predictions.predictions
            output = {
                "image_size": output["image_size"],
                "predictions": output["predictions"]
            }
            return output
        else:
            return None
        
    # ************************************************** #
    #               Update data from database            #
    # ************************************************** #
    def update_image_list_by_project_id(self, project_id, image_list):
        project = Project.query.filter_by(id=project_id).update({"image_list": image_list})

        return project
    