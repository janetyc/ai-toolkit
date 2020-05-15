from datetime import datetime
from aitoolkit import db
from sqlalchemy.dialects.postgresql import JSON

class Project(db.Model):
    __tablename = 'project'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_user = db.Column(db.Text())
    created_time = db.Column(db.DateTime())

    title = db.Column(db.Text())
    description = db.Column(db.Text())
    image_list = db.Column(JSON)

    def __init__(self, created_user, title, description):
        self.created_user = created_user
        self.title = title
        self.description = description

        self.created_time = datetime.utcnow()
    
    def __repr__(self):
        return '<Project %r>' % self.id


class Image(db.Model):
    __tablename__ = 'image'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_id = db.Column(db.Integer)
    image_url = db.Column(db.Text())
    image_key = db.Column(db.Text())

    # metadata
    title = db.Column(db.Text())
    description = db.Column(db.Text())
    annotations = db.Column(JSON)

    creatd_time = db.Column(db.DateTime())

    def __init__(self, project_id, image_url, image_key):
        self.project_id = project_id
        self.image_url = image_url
        self.image_key = image_key
        self.creatd_time = datetime.utcnow()

    def __repr__(self):
        return '<Image %r>' % self.id

class ObjectAnnotation(db.Model):
    __tablename__ = 'objectannotation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_id = db.Column(db.Integer)
    story_id = db.Column(db.Integer)
    created_user = db.Column(db.Text())

    label = db.Column(db.Text())
    x = db.Column(db.Float)
    y = db.Column(db.Float)
    w = db.Column(db.Float)
    h = db.Column(db.Float)

    verified_count = 0

    created_time = db.Column(db.DateTime())
    modified_time = db.Column(db.DateTime())

    def __init__(self, created_user, image_id, story_id, label, x, y, w, h):
        self.created_user = created_user
        self.image_id = image_id
        self.story_id = story_id
        self.label = label
        self.x = x
        self.y = y
        self.w = w
        self.h = h

        self.created_time = datetime.utcnow()

    def __repr__(self):
        return '<ObjectAnnotation %r>' % self.id

class StoryAnnotation(db.Model):
    __tablename__ = 'storyannotation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_id = db.Column(db.Integer)
    created_user = db.Column(db.Text())
    description = db.Column(db.Text())
    object_list = db.Column(JSON)

    verified_count = 0

    created_time = db.Column(db.DateTime())
    modified_time = db.Column(db.DateTime())

    def __init__(self, created_user, image_id, description):
        self.created_user = created_user
        self.image_id = image_id
        self.description = description

        self.created_time = datetime.utcnow()

    def __repr__(self):
        return '<StoryAnnotation %r>' % self.id


# for crowdosurcing task
class Task(db.Model):
    __tablename__ = 'task'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_user = db.Column(db.Text())
    task_type = db.Column(db.Text())

    problem = db.Column(db.Text())  #
    answer = db.Column(db.Text())  #

    created_time = db.Column(db.DateTime())
    submited_time = db.Column(db.DateTime())

    duration_time = db.Column(db.Float)

    verified_string = db.Column(db.Text())
    status = db.Column(db.Text())
    worker_id = db.Column(db.Text()) 
    hit_id = db.Column(db.Text())
    assignment_id = db.Column(db.Text())

    def __init__(self, created_user, task_type, problem, answer, duration_time, verified_string, status, worker_id, hit_id, assignment_id):
        self.created_user = created_user
        self.task_type = task_type

        self.problem = problem
        self.answer = answer
        self.duration_time = duration_time
        
        self.verified_string = verified_string
        self.status = status
        self.worker_id = worker_id
        self.hit_id = hit_id
        self.assignment_id = assignment_id
        
        self.created_time = datetime.utcnow()
        self.submited_time = datetime.utcnow()

    def __repr__(self):
        return '<Task %r>' % self.created_user


class ImagePrediction(db.Model):
    __tablename__ = 'imageprediction'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_name = db.Column(db.Text())
    image_key = db.Column(db.Text())
    image_url = db.Column(db.Text())
    predictions = db.Column(db.JSON)
    created_time = db.Column(db.DateTime())

    def __init__(self, model_name, image_key, image_url, predictions):
        self.model_name = model_name
        self.image_key = image_key
        self.image_url = image_url
        self.predictions = predictions

        self.created_time = datetime.utcnow()

    def __repr__(self):
        return 'ImagePrediction %r' % self.id
