import firebase_admin
from firebase_admin import credentials, firestore
import json 
import flask

cred = credentials.Certificate('backend/AccountServiceKey.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

def add_task(user, task, date, location, notes):
    doc_ref = db.collection('users').document(user).collection('tasks').document(task)
    doc_ref.set({
        'date': date,
        'location': location,
        'notes': notes,
    })   

def complete_task(user, task):
    doc_ref = db.collection('users').document(user).collection('tasks').document(task)
    doc_ref.delete()

def return_tasks(user):
    tasks = []
    try:
        doc_ref = db.collection('users').document(user).collection('tasks')
        docs = doc_ref.list_documents()
        for i in docs:
            tasks.append(i.id)

    except google.cloud.exceptions.NotFound:
        print('doc not found')

    return tasks


