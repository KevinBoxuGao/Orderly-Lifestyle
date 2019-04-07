from google.cloud import firestore
db = firestore.Client()

id_token = 'kevingao2003@gmail.com'
doc_ref = db.collection('users').document(id_token).collection('tasks')
docs = doc_ref.list_documents()

print(docs)