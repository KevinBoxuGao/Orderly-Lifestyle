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

class Account(ndb.Model):
    email = ndb.StringProperty()
    tasks = ndb.StringProperty(repeated=True)
    created = ndb.DateTimeProperty(auto_now_add=True)

def query_database(user_id):
    ancestor_key = ndb.Key(Account, user_id)
    query = Account.query(ancestor=ancestor_key).order(-Account.created)
    accountData = query.fetch()

    data = []
    if len(accountData) > 0:
        accountData = accountData[0]
        data.append({
            'key' : accountData.key,
            'tasks' : accountData.tasks,
            'created' : accountData.created
        })

    return data

@app.route('/accountdata', methods=['GET'])
def list_tasks():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    tasks = query_database(claims['sub'])[0]['tasks']

    return jsonify(tasks)

@app.route('/accountdata', methods=['POST', 'PUT'])
def addtask():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401        

    json = request.get_json()
    data = query_database(claims['sub'])

    data = data[0]

    task = Account(
        parent = ndb.Key(Account, claims['sub']),
        tasks=data['tasks']+[json['task']]
    )

    task.put()

    return 'OK', 200

@app.route('/register', methods=['POST', 'PUT'])
def register():

    # Verify Firebase auth.
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    data = query_database(claims['sub'])
    if len(data) == 0:
        accountData = Account(
            parent=ndb.Key(Account, claims['sub']),
            email = claims.get('name', claims.get('email', 'Unknown')),
            tasks=[])

        accountData.put()

    return 'OK', 200

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500












