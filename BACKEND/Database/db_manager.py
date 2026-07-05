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



""" ZAHRA'S MODULES: NEURAL JOURNAL & MEMORY CORE LOGIC """


def save_journal_entry(content, mood=None):
    """Saves a private reflection usng schema structure"""
    if not content or not content.strip():
        raise ValueError("Journal content cannot be empty.")
        
    conn = get_connection()
    try:
        timestamp = datetime.now().isoformat(sep=" ", timespec="seconds")
        
        conn.execute(
            "INSERT INTO journal_entries (content, mood, created_at) VALUES (?, ?, ?)",
            (content.strip(), mood.strip() if mood else None, timestamp)
        )
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"Database error while saving journal: {e}")
        return False
    finally:
        conn.close()


def search_journal_entries(keyword):
    """Searches past journal entries using a keyword or phrase"""
    if not keyword or not keyword.strip():
        return []
        
    conn = get_connection()
    search_query = f"%{keyword.strip()}%"
    rows = conn.execute(
        "SELECT id, content, mood, created_at FROM journal_entries "
        "WHERE content LIKE ? ORDER BY created_at DESC",
        (search_query,)
    )
    results = [dict(r) for r in rows.fetchall()]
    conn.close()
    return results


def update_user_memory(key, value, source="user"):
    """Updates or inserts user traits, interests, or projects into memory_entries"""
    if not key or not key.strip() or not value or not value.strip():
        raise ValueError("Key and Value cannot be empty.")

    conn = get_connection()
    try:
        timestamp = datetime.now().isoformat(sep=" ", timespec="seconds")
        
        # UPSERT syntax configured for Zoya's columns
        conn.execute("""
            INSERT INTO memory_entries (key, value, source, created_at) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value, 
                updated_at = ?
        """, (key.strip(), value.strip(), source.strip(), timestamp, timestamp))
        
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"Memory update error: {e}")
        return False
    finally:
        conn.close()


def get_all_memories():
    """Retrieves all stored context pieces as a clean dictionary for the AI"""
    conn = get_connection()
    rows = conn.execute("SELECT key, value FROM memory_entries").fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


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

"""zahra here, just testing"""

    print("\n--- Testing Zahra's Modules ---")
    save_journal_entry("Figured out Git streams with Zoya! Feeling productive.", mood="🚀 excited")
    update_user_memory("interests", "Python, PyQt6, UI design")
    
    print("Search results for 'Git':", search_journal_entries("Git"))
    print("All System Memories:", get_all_memories())

