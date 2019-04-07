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

@app.route('/users', methods=['GET'])
def getTasks():
    id_token = request.headers['Authorization'].split(' ').pop()

    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
        

    doc_ref = db.collection('users').document(id_token).collection('tasks')
    docs = doc_ref.list_documents()

    print(docs)
    return jsonify(docs)


#@app.route('/tasks', methods=['POST', 'PUT'])
























