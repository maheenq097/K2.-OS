# K2.OS Version 1 — Connected Backend Server (Python 3)
# Listens on http://localhost:3000
# Serves Apple UI Frontend & Full REST API with db.json persistence

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime

PORT = 3000
DB_FILE = os.path.join(os.path.dirname(__file__), 'db.json')

DEFAULT_DB = {
    "profile": {
        "name": "Alex Vance",
        "role": "Founder & Software Engineer",
        "motto": "Build. Learn. Lead.",
        "mountainGoal": "Conquer K2 - Launching K2.OS Personal Operating System",
        "joinedDate": "Summer 2026"
    },
    "interests": [
        "Artificial Intelligence & LLMs",
        "System Architecture",
        "Human-Computer Interaction",
        "High-Altitude Expedition Philosophy",
        "Productivity Engineering",
        "Full-Stack Web Development"
    ],
    "projects": [
        { "id": "proj-1", "title": "K2.OS Version 1 Proof of Concept", "status": "In Progress", "goal": "Establish personal AI operating system foundation by end of Summer 2026" },
        { "id": "proj-2", "title": "Neural Memory Core Integration", "status": "Active", "goal": "Inject persistent user context into AI chat" },
        { "id": "proj-3", "title": "Apple Interface Design System", "status": "Completed", "goal": "Build pixel-perfect macOS/iOS glassmorphic frontend" }
    ],
    "tasks": [
        { "id": "task-1", "title": "Test K2.OS Neural Journal & AI Assistant", "priority": "High", "category": "Project", "status": "Pending", "dueDate": "2026-08-15" },
        { "id": "task-2", "title": "Refine Memory Core profile & interest tags", "priority": "Medium", "category": "Personal", "status": "Pending", "dueDate": "2026-08-18" },
        { "id": "task-3", "title": "Verify GitHub repository synchronization", "priority": "High", "category": "Project", "status": "Completed", "dueDate": "2026-08-09" }
    ],
    "journals": [
        {
            "id": "j-1",
            "title": "The Philosophy Behind K2.OS",
            "tag": "Reflection",
            "date": "2026-08-09 14:30",
            "content": "Unlike Everest, K2 is known for being difficult, demanding, and unforgiving. Success requires preparation, discipline, teamwork, adaptability, and resilience.\n\nEveryone is climbing their own mountain. K2.OS is intended to act as a personal basecamp, navigation system, and command center for that journey."
        }
    ],
    "settings": {
        "theme": "dark",
        "wallpaper": "k2-snow",
        "soundEnabled": True,
        "volume": 0.6
    },
    "chatHistory": [
        {
            "sender": "ai",
            "text": "Welcome to K2.OS Version 1 — Connected Backend Active on localhost:3000. How can I assist with your ascent today?",
            "time": "12:00 PM",
            "memoryInjected": True
        }
    ]
}

def load_db():
    if not os.path.exists(DB_FILE):
        save_db(DEFAULT_DB)
        return DEFAULT_DB
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading DB: {e}")
        return DEFAULT_DB

def save_db(data):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving DB: {e}")

class K2BackendHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
        super().__init__(*args, directory=frontend_dir, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/health':
            self.send_json({"status": "online", "server": "K2.OS Backend", "port": PORT, "time": str(datetime.now())})
            return

        if path == '/api/db':
            db = load_db()
            self.send_json(db)
            return

        if path == '/api/profile':
            db = load_db()
            self.send_json(db.get("profile", {}))
            return

        if path == '/api/tasks':
            db = load_db()
            self.send_json(db.get("tasks", []))
            return

        if path == '/api/journals':
            db = load_db()
            self.send_json(db.get("journals", []))
            return

        if path == '/api/memory':
            db = load_db()
            self.send_json({
                "profile": db.get("profile", {}),
                "interests": db.get("interests", []),
                "projects": db.get("projects", [])
            })
            return

        if path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        db = load_db()

        if path == '/api/db':
            save_db(body)
            self.send_json({"success": True, "message": "Full database updated"})
            return

        if path == '/api/profile':
            db["profile"] = body
            save_db(db)
            self.send_json({"success": True, "profile": db["profile"]})
            return

        if path == '/api/tasks':
            task_id = body.get('id', f"task-{int(datetime.now().timestamp()*1000)}")
            body['id'] = task_id
            existing = [t for t in db['tasks'] if t['id'] == task_id]
            if existing:
                idx = db['tasks'].index(existing[0])
                db['tasks'][idx] = body
            else:
                db['tasks'].insert(0, body)
            save_db(db)
            self.send_json({"success": True, "task": body, "tasks": db['tasks']})
            return

        if path == '/api/journals':
            j_id = body.get('id', f"j-{int(datetime.now().timestamp()*1000)}")
            body['id'] = j_id
            existing = [j for j in db['journals'] if j['id'] == j_id]
            if existing:
                idx = db['journals'].index(existing[0])
                db['journals'][idx] = body
            else:
                db['journals'].insert(0, body)
            save_db(db)
            self.send_json({"success": True, "journal": body, "journals": db['journals']})
            return

        if path == '/api/ai-chat':
            user_msg = body.get('message', '').strip()
            profile = db.get('profile', {})
            tasks = db.get('tasks', [])
            journals = db.get('journals', [])
            projects = db.get('projects', [])

            pending_tasks = [t for t in tasks if t.get('status') == 'Pending']
            msg_lower = user_msg.lower()

            if 'task' in msg_lower or 'objective' in msg_lower:
                ai_reply = f"Connected Backend Status for <strong>{profile.get('name')}</strong>:<br>" \
                           f"• You have <strong>{len(pending_tasks)} pending objectives</strong>.<br>" + \
                           "<br>".join([f"- [{t.get('priority')}] {t.get('title')}" for t in pending_tasks])
            elif 'journal' in msg_lower or 'reflection' in msg_lower:
                ai_reply = f"Backend Neural Memory Status:<br>" \
                           f"• Total Reflections Saved: <strong>{len(journals)}</strong><br>" \
                           f"• Latest Reflection Title: <em>{journals[0].get('title') if journals else 'None'}</em>"
            else:
                ai_reply = f"K2.OS Backend (localhost:3000) Active.<br><br>" \
                           f"User Context Injected: <strong>{profile.get('name')}</strong> ({profile.get('role')})<br>" \
                           f"Mountain Goal: <em>\"{profile.get('mountainGoal')}\"</em><br>" \
                           f"Active Projects: {', '.join([p.get('title') for p in projects])}"

            new_history = db.get('chatHistory', [])
            new_history.append({"sender": "user", "text": user_msg, "time": datetime.now().strftime("%I:%M %p")})
            new_history.append({"sender": "ai", "text": ai_reply, "time": datetime.now().strftime("%I:%M %p"), "memoryInjected": True})
            db['chatHistory'] = new_history
            save_db(db)

            self.send_json({"success": True, "reply": ai_reply, "chatHistory": new_history})
            return

        if path == '/api/reset':
            save_db(DEFAULT_DB)
            self.send_json({"success": True, "message": "Database reset to initial basecamp default"})
            return

        self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        db = load_db()

        if path == '/api/tasks':
            item_id = query.get('id', [None])[0]
            if item_id:
                db['tasks'] = [t for t in db['tasks'] if t['id'] != item_id]
                save_db(db)
                self.send_json({"success": True, "tasks": db['tasks']})
                return

        if path == '/api/journals':
            item_id = query.get('id', [None])[0]
            if item_id:
                db['journals'] = [j for j in db['journals'] if j['id'] != item_id]
                save_db(db)
                self.send_json({"success": True, "journals": db['journals']})
                return

        self.send_error(404, "Resource not found")

    def send_json(self, data):
        content = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    print(f"K2.OS Backend Server starting on http://localhost:{PORT}")
    print(f"Database path: {DB_FILE}")
    print(f"Apple Interface Frontend connected & available at http://localhost:{PORT}")
    
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("0.0.0.0", PORT), K2BackendHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()
