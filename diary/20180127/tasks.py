import os
from celery import Celery
import time

app = Celery()
app.conf.broker_url = 'redis://localhost:6379/0'
app.conf.result_backend = 'redis://localhost:6379/0'


@app.task
def hello():
    time.sleep(5)
    return os.getpid()
