
import os

import redis
import config
from rq import Worker, Queue, Connection
import pyrebase
conn = redis.from_url(config.REDIS_URL)

listen = ['ml-task']
if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
