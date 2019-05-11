import logging
from flask import Flask, jsonify, request
import flask_cors
from google.appengine.ext import ndb
import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

app = Flask(__name__)
flask_cors.CORS(app)

class Task(ndb.Model):
    id = ndb.StringProperty()
    task = ndb.StringProperty()
    date = ndb.StringProperty()
    location = ndb.StringProperty()
    note = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)

def query_database(user_id):
    ancestor_key = ndb.Key(Task, user_id)
    query = Task.query(ancestor=ancestor_key).order(-Task.created)
    tasks = query.fetch()

    data = []

    for task in tasks:
        data.append({
            'id': str(task.key),
            'task': task.task,
            'date': task.date,
            'location': task.location,
            'note': task.note
        })

    return data

@app.route('/tasks', methods=['GET'])
def list_tasks():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    tasks = query_database(claims['sub'])
    return jsonify(tasks)

@app.route('/tasks', methods=['POST', 'PUT'])
def addtask():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401        

    json = request.get_json()

    task = Task(
        parent = ndb.Key(Task, claims['sub']),
        task = json['task'],
        date = json['date'],
        location = json['location'],
        note = json['note']
    )
    task.put()
    return 'OK', 200

@app.route('/removetasks', methods=['POST', 'PUT'])
def deletetask():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401        

    json = request.get_json()
    id = json['id']
    idContents = id[4:-1]
    args = idContents.split(', ')

    args = idContents.split(', ')
    args[3] = int(args[3])

    for i in range(len(args)-1):
        args[i] = args[i].strip("'")

    ndb.Key(*args).delete()
    
    return 'OK', 200

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500












