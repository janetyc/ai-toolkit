import json

from aitoolkit.models import Project
from aitoolkit.models import Dataset
from aitoolkit.models import Image, ImageAnnotation

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

    def add_dataset(self, project_id, db_type):
        dataset = Dataset(project_id, db_type)
        db.session.add(dataset)
        db.session.commit()

        return imagedata.id
    
    def add_image(self, dataset_id, image_url, title):
        image = Image(dataset_id, image_url, title)
        db.session.add(image)
        db.session.commit()

        return image.id

    def add_image_annotation(self, created_user, img_id, label, x, y, w, h):
        image_annotation = ImageAnnotation(created_user, img_id, label, x, y, w, h)
        db.session.add(image_annotation)
        db.session.commit()

        return image_annotation.id

    # ************************************************** #
    #               Get data from database               #
    # ************************************************** #
    def get_all_projects(self):
        projects = Project.query.all()
        return projects

    def get_project_by_id(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        return project

    def get_images_by_dataset_id(self, dataset_id):
        dataset = Dataset.query.filter_by(id=dataset_id).first()
        if dataset.db_type == DataType.IMAGEDATA.value:
            all_images = Image.query.filter_by(dataset_id=dataset.id).all()
            return all_images
        else:
            return None      

    def get_all_images_by_project_id(self, project_id):
        project = self.get_project_by_id(project_id)
        datasets = json.loads(project.datasets)

        dataset_ids = json.loads(imagedata.dataset_ids)
        all_images = []
        for dataset_id in dataset_ids:
            dataset = Dataset.query.filter_by(id=dataset_id).first()
            if dataset.db_type == DataType.IMAGEDATA.value:
                all_images.append(self.get_images_by_dataset_id(dataset_id))
            
        return all_images
        
    # ************************************************** #
    #               Update data from database            #
    # ************************************************** #
    def updateData():
        return
    