import os

PROJECT_NAME = "aitoolkit"
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


FIREBASE_CONFIG = {
  "apiKey": os.environ.get('FIREBASE_APIKEY') or "",
  "authDomain": os.environ.get('FIREBASE_AUTH_DOMAIN') or "",
  "databaseURL": os.environ.get('FIREBASE_DATABASE_URL') or "",
  "storageBucket": os.environ.get('FIREBASE_STORAGEBUCKET') or "",
#   "serviceAccount": os.environ.get('FIREBASE_SERVICE_ACCOUNT') or ""
}

IMAGE_CLASSIFITER_MODELS = {
    "SSD_MobileNet_V2": "ssd_mobilenet_v2_coco_2018_03_29",
    "FasterRCNN_Inceptionv2": "faster_rcnn_inception_v2_coco_2018_01_28",
    "FasterRCNN_ResNet" :"faster_rcnn_resnet50_coco_2018_01_28",
    "Mask_RCNN": "mask_rcnn_inception_v2_coco_2018_01_28"
}
PATH_TO_LABELS = 'mscoco_label_map.pbtxt'

class Config(object):
    DEBUG = False
    TESTING = False

    SQLALCHEMY_DATABASE_URI = "postgresql://localhost/aitoolkit"
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or "postgresql://localhost/aitoolkit"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = "postgresql://localhost/aitoolkit"
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or "postgresql://localhost/aitoolkit"
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class DebugConfig(Config):
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or "postgresql://localhost/aitoolkit"
    SQLALCHEMY_TRACK_MODIFICATIONS = True

