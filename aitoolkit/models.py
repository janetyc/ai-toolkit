from aitoolkit import db

# class Mtask(db.Model):
#     __tablename__ = 'mtask'

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     created_user = db.Column(db.Text())

#     verified_string = db.Column(db.Text())
#     hit_id = db.Column(db.Text())
#     worker_id = db.Column(db.Text())
#     assignment_id = db.Column(db.Text())

#     created_time = db.Column(db.DateTime())
#     accepted_time = db.Column(db.DateTime())
#     submited_time = db.Column(db.DateTime())

#     def __init__(self, created_user, verified_string, hit_id, worker_id, assignment_id):
#         self.created_user = created_user

#         self.verified_string = verified_string
#         self.hit_id = hit_id
#         self.worker_id = worker_id
#         self.assignment_id = assignment_id

#         self.created_time = datetime.utcnow()
#         self.accepted_time = None
#         self.submited_time = None

#     def __repr__(self):
#         return '<Mtask %r>' % self.id


class Task(db.Model):
    __tablename__ = 'task'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_user = db.Column(db.Text())
    task_type = db.Column(db.Text())

    problem = db.Column(db.Text())  # video_id
    answer = db.Column(db.Text())  # list of output_ids (e.g. reflection_id1,reflection_id2, etc)

    created_time = db.Column(db.DateTime())
    submited_time = db.Column(db.DateTime())

    duration_time = db.Column(db.Float)

    verified_string = db.Column(db.Text())
    status = status
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

