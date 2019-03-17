#!C:\Python\Python37\python.exe -u
import cgi
import json

form = cgi.FieldStorage()
name = form.getvalue('name')
time = form.getvalue('time')
location = form.getvalue('location')
date = form.getvalue('date')

print("Content-Type: text/html")
print()
print("<HTML>")
print("<BODY>")
print("HELLO WORLD!")
print(name)
print(time)
print(location)
print(date)
print("</BODY>")
print("</HTML>")




