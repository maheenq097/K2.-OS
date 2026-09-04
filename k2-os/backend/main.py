"""
main.py
Backend Core — K2.OS Flask REST API Server
Listens on http://localhost:3000 (and 5000)
"""

import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
try:
    from ai_core import send_message
except ImportError:
    def send_message(msg):
        return f"AI Response: Received '{msg}'"

try:
    from Database.db_manager import (
        init_db,
        add_memory,
        get_all_memories,
        get_memory,
        delete_memory,
        get_all_tasks,
        add_task,
        toggle_task,
        delete_task,
        get_all_journals,
        save_journal_entry,
        delete_journal_entry,
        get_dashboard_snapshot
    )
except ImportError:
    def init_db(): pass
    def add_memory(k, v): pass
    def get_all_memories(): return {}
    def get_all_tasks(): return []
    def get_all_journals(): return []

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

init_db()


@app.route("/")
def serve_frontend():
    if os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return jsonify({"status": "online", "message": "K2.OS Backend Active"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "system": "K2.OS Backend Server", "port": 3000})


@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    ai_response = send_message(user_message)
    return jsonify({"response": ai_response, "reply": ai_response})


@app.route("/api/ai-chat", methods=["POST"])
def ai_chat_alias():
    return chat()


@app.route("/api/memory", methods=["POST"])
def add_memory_route():
    data = request.json or {}
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


@app.route("/api/tasks", methods=["GET"])
def get_tasks_route():
    tasks = get_all_tasks()
    return jsonify(tasks)


@app.route("/api/journals", methods=["GET"])
def get_journals_route():
    journals = get_all_journals()
    return jsonify(journals)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    print(f"K2.OS Backend running on http://localhost:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)
