"""
main.py
Backend Core — K2.OS
"""

import os
import sys

from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
from ai_core import send_message
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from Database.db_manager import add_memory, get_all_memories, delete_memory, get_memory

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    ai_response = send_message(user_message)
    return jsonify({"response": ai_response})


@app.route("/api/memory", methods=["POST"])
def add_memory_route():
    data = request.json
    key = data.get("key")
    value = data.get("value")
    if not key or not value:
        return jsonify({"error": "Key and value are required"}), 400
    add_memory(key, value)
    return jsonify({"message": "Memory added successfully"})


@app.route("/api/memory", methods=["GET"])
def get_all_memories_route():
    memories = get_all_memories()
    return jsonify(memories)


@app.route("/api/memory/<key>", methods=["GET"])
def get_memory_route(key):
    memory = get_memory(key)
    if memory:
        return jsonify({key: memory})
    return jsonify({"error": "Memory not found"}), 404


@app.route("/api/memory/<key>", methods=["DELETE"])
def delete_memory_route(key):
    delete_memory(key)
    return jsonify({"message": "Memory deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
