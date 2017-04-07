import threading
from time import sleep
import os
import json
import imp

import uuid
from bottle import route, run, template, static_file, response, request, install, default_app


def return_json(result):
	response.content_type = 'application/json'
	return json.dumps(result)

@route('/')
def index():
	return static_file('index.html', root='')

@route('<filepath:path>')
def server_static(filepath):
	return static_file(filepath, root='')

@route('/tourpedia')
def tourpedia():
	return static_file('/dashboards/tourpedia.html', root='')

application = default_app()

#run(reloader=True)
if __name__ == '__main__':
    run(host='0.0.0.0', port=8080, debug=True)
