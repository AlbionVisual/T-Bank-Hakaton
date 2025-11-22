from flask import Flask, jsonify, request
from flask_cors import CORS
from database import *
from query_openrouter import query_openrouter

app = Flask(__name__)
CORS(app)

@app.route('/api/chats', methods=['GET'])
def get_dichae():
    return jsonify(dialog_list_request(dict_return=True))


if __name__ == '__main__':
    app.run(debug=True, port=5000)