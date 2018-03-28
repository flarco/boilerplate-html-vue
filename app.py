import string, os, sys, random
import socketio
import eventlet
import eventlet.wsgi
from flask import (
  Flask, redirect, request,
  render_template, render_template_string ,session,
  make_response, url_for, jsonify, send_from_directory
)
from flask_assets import Environment, Bundle
from livereload import Server, shell

args = sys.argv[1:]

class Flask2(Flask):
  jinja_options = Flask.jinja_options.copy()
  jinja_options.update(dict(
    block_start_string='(%',
    block_end_string='%)',
    variable_start_string='((',
    variable_end_string='))',
    comment_start_string='(#',
    comment_end_string='#)',
  ))

debug = True
sio = socketio.Server()
application = Flask2(__name__)
cookie_session_key = 'SID'
port=50008

# remember to use DEBUG mode for templates auto reload
# https://github.com/lepture/python-livereload/issues/144
application.debug = debug
assets = Environment(application)
js = Bundle('js/*.js', filters='jsmin', output='build.js')
assets.register('js_all', js)
js.build()

def get_cookie(req):
  session_id = (
    req.cookies.get(cookie_session_key)
    or ''.join(
      random.SystemRandom().choice(
        string.ascii_uppercase + string.digits + string.ascii_lowercase
      ) for _ in range(48)
    )
  )
  return session_id


@sio.on('connect')
def connect(sid, environ):
  print("Connected to Front-End GUI! ")
  return {'msg':'Connected to server!'}

def process_request(req):
  val_dict = request.values.to_dict()
  form_dict = request.form
  data_dict = json.loads(request.data.decode('utf-8')) if request.data else {}
  return (val_dict, form_dict, data_dict)


@application.route('/', methods=['GET'])
def index():
  session_id = get_cookie(request)
  (val_dict, form_dict, data_dict) = process_request(request)

  if 'session_id' in val_dict:
    session_id = val_dict['session_id']
  
  msg = request.cookies.get('message')
  
  resp = make_response(render_template('index.html'))

  resp.set_cookie(cookie_session_key, session_id)
  resp.set_cookie('message', '', expires=0)

  return resp


application = socketio.Middleware(sio, application)

server = Server(application.wsgi_app)
server.watch('static/js/', func=js.build)
server.watch('static/build.js')
server.watch('templates/*')

# server.serve(port=port, host='0.0.0.0')
eventlet.wsgi.server(eventlet.listen(('0.0.0.0', port)), application)
