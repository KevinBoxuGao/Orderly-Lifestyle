import logging
from flask import Flask, jsonify, request
import flask_cors
from google.appengine.ext import ndb
import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine

claims = '1uHcNxWjjBPoVTtjZCnT8ZKNHdG3'

class Task(ndb.Model):
    task = ndb.StringProperty()
    date = ndb.StringProperty()
    location = ndb.StringProperty()
    date = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)

def query_database(user_id):
    ancestor_key = ndb.Key(Task, user_id)
    query = Task.query(ancestor=ancestor_key).order(-Task.created)
    taskNames = query.fetch()

    task_messages = []

    for task in taskNames:
        task_messages.append({
            'name': task.name,
            'date': task.date,
            'location': task.location,
            'note': task.note
        })
    return task_messages

query_database(claims)