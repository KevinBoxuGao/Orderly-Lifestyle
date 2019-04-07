import logging
from flask import Flask, jsonify, request
import flask_cors

import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine

#from google.cloud import firestore

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

#db = firestore.Client()

app = Flask(__name__)
flask_cors.CORS(app)

@app.route('/user', methods=['GET'])
def getTasks():
    id_token = request.headers['Authorization'].split(' ').pop()

    #claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    #if not claims:
    #    return 'Unauthorized', 401
        
    #doc_ref = db.collection('users').document(id_token).collection('tasks')
    #docs = doc_ref.list_documents()
    yes = [ "Ford", "BMW", "Fiat" ]

    return jsonify(docs)




























