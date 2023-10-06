import sys

from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
socketio = SocketIO()
CORS(app)


def shutdown_server():
    if func := request.environ.get('werkzeug.server.shutdown'):
        func()
        return 'Server shutting down...'
    return 'Not running with the Werkzeug Server'


@app.route('/')
def index():
    sys.stdout.write('Flask reached homie')
    return {'message': "All good buddy!"}


@app.route('/shutdown')
def exit_server():
    return jsonify(shutdown_server())


if __name__ == '__main__':
    port = sys.argv[1] if sys.argv else 8000
    app.run(debug=True, port=port)
