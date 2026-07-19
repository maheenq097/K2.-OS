"""
db_manager.py
Zoya's module — Database Initialization + Objectives Logic + Mission Control Feed
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "k2os.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()
    conn.executescript(schema)
    conn.commit()
    conn.close()
    print(f"[K2.OS] Database initialized at {DB_PATH}")


def add_task(title, description="", priority="normal"):
    if not title or not title.strip():
        raise ValueError("Task title cannot be empty.")

    conn = get_connection()
    cur = conn.execute(
        "INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)",
        (title.strip(), description.strip(), priority),
    )
    conn.commit()
    task_id = cur.lastrowid
    conn.close()
    return task_id


def toggle_task(task_id):
    conn = get_connection()
    row = conn.execute("SELECT is_complete FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if row is None:
        conn.close()
        raise ValueError(f"No task found with id {task_id}.")

    new_state = 0 if row["is_complete"] else 1
    conn.execute(
        "UPDATE tasks SET is_complete = ?, updated_at = ? WHERE id = ?",
        (new_state, datetime.now().isoformat(sep=" ", timespec="seconds"), task_id),
    )
    conn.commit()
    conn.close()
    return bool(new_state)


def delete_task(task_id):
    conn = get_connection()
    cur = conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    deleted = cur.rowcount > 0
    conn.close()
    return deleted


def get_all_tasks(include_completed=True):
    conn = get_connection()
    if include_completed:
        rows = conn.execute("SELECT * FROM tasks ORDER BY created_at DESC").fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM tasks WHERE is_complete = 0 ORDER BY created_at DESC"
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_dashboard_snapshot(task_limit=5, journal_limit=3):
    conn = get_connection()

    pending_tasks = conn.execute(
        "SELECT id, title, priority, created_at FROM tasks "
        "WHERE is_complete = 0 ORDER BY created_at DESC LIMIT ?",
        (task_limit,),
    ).fetchall()

    recent_journals = conn.execute(
        "SELECT id, content, mood, created_at FROM journal_entries "
        "ORDER BY created_at DESC LIMIT ?",
        (journal_limit,),
    ).fetchall()

    stats = conn.execute(
        "SELECT "
        "COUNT(*) AS total, "
        "SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) AS completed, "
        "SUM(CASE WHEN is_complete = 0 THEN 1 ELSE 0 END) AS pending "
        "FROM tasks"
    ).fetchone()

    conn.close()

    return {
        "pending_tasks": [dict(r) for r in pending_tasks],
        "recent_journals": [dict(r) for r in recent_journals],
        "stats": dict(stats) if stats else {"total": 0, "completed": 0, "pending": 0},
    }


if __name__ == "__main__":
    init_db()

    t1 = add_task("Draft schema.sql", "Design tables for tasks/journals/memory", "high")
    t2 = add_task("Build Mission Control query", priority="normal")
    toggle_task(t1)

    print("\nAll tasks:")
    for t in get_all_tasks():
        print(t)

    print("\nDashboard snapshot:")
    print(get_dashboard_snapshot())

def add_memory(key, value, source="user"):
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO memory_entries (key, value, source) VALUES (?, ?, ?)",
        (key, value, source)
    )
    conn.commit()
    conn.close()
    return True

def update_user_memory(key, value, source="user"):
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO memory_entries (key, value, source) VALUES (?, ?, ?)",
        (key, value, source)
    )
    conn.commit()
    conn.close()
    return True

def get_all_memories():
    conn = get_connection()
    rows = conn.execute("SELECT key, value FROM memory_entries").fetchall()
    conn.close()
    return {row["key"]: row["value"] for row in rows}

def get_memory(key):
    conn = get_connection()
    row = conn.execute(
        "SELECT value FROM memory_entries WHERE key = ?", (key,)
    ).fetchone()
    conn.close()
    return row["value"] if row else None

def delete_memory(key):
    conn = get_connection()
    conn.execute("DELETE FROM memory_entries WHERE key = ?", (key,))
    conn.commit()
    conn.close()
    return True

