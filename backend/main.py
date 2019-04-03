import pyrebase

config = {
    "authDomain": "orderly-life.firebaseapp.com",
    "apiKey": "AIzaSyAB5gvYSeK8U4KSKlBcPRADDVyWi4dLsMg",
    "databaseURL": "https://orderly-life.firebaseio.com",
    "projectId": "orderly-life",
    "storageBucket": "orderly-life.appspot.com",
    "serviceAccount": "backend/AccountServiceKey.json"
}

firebase = pyrebase.initialize_app(config)

auth = firebase.auth()
user = auth.sign_in_with_email_and_password("kevingao2003@gmail.com", "Gaoww8922")

info = auth.get_account_info(user['idToken'])
#print(info)

db = firebase.database()

data = {
    "name": "Mortimer 'Morty' Smith"
}

results = db.child("users").set(data)

