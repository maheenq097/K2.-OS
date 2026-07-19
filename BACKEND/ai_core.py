"""
ai_core.py
AI Chat Module — OpenRouter API Integration + Memory Injection
"""

import os
import sys
import requests
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from Database.db_manager import get_all_memories

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
URL = "https://openrouter.ai/api/v1/chat/completions"


def get_memories_context():
    try:
        memories = get_all_memories()
    except Exception as e:
        print(f"[Warning] Could not retrieve memories: {e}")
        return "No stored memories yet."
    if not memories:
        return "No stored memories yet."
    context = "User Context & Memories:\n"
    for key, value in memories.items():
        context += f"- {key}: {value}\n"
    return context


def build_system_prompt():
    memories_context = get_memories_context()
    return f"""You are K2.OS, a personal basecamp AI. You help the user manage goals, tasks, and reflections.
You are calm, direct, and supportive.

{memories_context}

Your role:
1. Help the user manage tasks and goals
2. Support reflection through journal entries
3. Learn and remember user preferences and patterns
4. Provide personalized, context-aware responses"""


def send_message(user_message: str) -> str:
    if not user_message or not user_message.strip():
        return "Please send a message."
    if not API_KEY:
        return "[Error] OPENROUTER_API_KEY not set. Check your .env file."
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openrouter/auto",
        "messages": [
            {"role": "system", "content": build_system_prompt()},
            {"role": "user", "content": user_message.strip()}
        ]
    }
    try:
        response = requests.post(URL, headers=headers, json=payload, timeout=15)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        return f"[Error] Request failed: {e}"
    except KeyError:
        return "[Error] Unexpected API response format."


if __name__ == "__main__":
    # This section is for testing the AI core functionality.
    # It will not be used in the final K2.OS application.
    print("K2.OS AI Core Test Suite\n--------------------")

    # Test 1: Empty message
    print("\n[Test 1] Sending empty message...")
    response = send_message("")
    print(f"Response: {response}")
    assert "Please send a message." in response

    # Test 2: Message without API key
    print("\n[Test 2] Sending message without API key (simulated)...")
    original_api_key = os.getenv("OPENROUTER_API_KEY")
    os.environ["OPENROUTER_API_KEY"] = ""
    response = send_message("Hello, K2!")
    print(f"Response: {response}")
    assert "[Error] OPENROUTER_API_KEY not set." in response
    if original_api_key:
        os.environ["OPENROUTER_API_KEY"] = original_api_key

    # Test 3: Get memories context
    print("\n[Test 3] Getting memories context...")
    memories_context = get_memories_context()
    print(f"Memories Context: {memories_context}")
    # This test assumes no memories are stored initially for a clean run.
    # If you have existing memories, this test might need adjustment or a mocked db.
    assert "No stored memories yet." in memories_context or "User Context & Memories:" in memories_context

    # Test 4: Build system prompt
    print("\n[Test 4] Building system prompt...")
    system_prompt = build_system_prompt()
    print(f"System Prompt: {system_prompt}")
    assert "You are K2.OS, a personal basecamp AI." in system_prompt
    assert "No stored memories yet." in system_prompt or "User Context & Memories:" in system_prompt

    # Test 5: Real message (requires API key to be set)
    if API_KEY:
        print("\n[Test 5] Sending a real message (if API_KEY is set)...")
        response = send_message("What is your purpose?")
        print(f"Response: {response}")
        assert "[Error]" not in response  # Expect a successful response, not an error
    else:
        print("\n[Test 5] Skipping real message test: OPENROUTER_API_KEY is not set.")

    print("\n--------------------\nAI Core Test Suite Finished.")
