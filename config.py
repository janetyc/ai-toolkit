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

