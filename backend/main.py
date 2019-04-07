import logging
from flask import Flask, jsonify, request
import flask_cors

import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine
from google.cloud import firestore

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

app = Flask(__name__)
flask_cors.CORS(app)

db = firestore.Client()
print 'yes'

@app.route('/user', methods=['GET'])
def getTasks():
    id_token = request.headers['Authorization'].split(' ').pop()
    print 'yes'
    print id_token

    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
        
    doc_ref = db.collection('users').document(id_token).collection('tasks')
    docs = doc_ref.list_documents()
    print id_token
    return jsonify(id_token)



#@app.route('/tasks', methods=['POST', 'PUT'])
























