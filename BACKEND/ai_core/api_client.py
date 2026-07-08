"""
K2.OS - AI Core - api_client.py
Adeeba's module: connects to OpenRouter API, sends a prompt, returns clean text.
"""

import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

URL = "https://openrouter.ai/api/v1/chat/completions"


def send_message(user_message: str) -> str:
    """
    Sends a message to the OpenRouter API and returns the AI's reply as plain text.
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
    "model": "openrouter/free",
    "messages": [
        {"role": "system", "content": "You are K2.OS, a personal basecamp AI. You help the user manage goals, tasks, and reflections. You are calm, direct, and supportive — not overly emotional, not robotic."},
        {"role": "user", "content": user_message}
    ]
}

    try:
        response = requests.post(URL, headers=headers, json=payload, timeout=15)

        if response.status_code != 200:
            print("FULL ERROR DETAILS:", response.text)
            return f"[Error] API returned status {response.status_code}. Check your API key."

        data = response.json()
        choices = data.get("choices")
        if not choices:
            return "[Error] No response received from the AI."

        reply_text = choices[0]["message"]["content"]
        return reply_text.strip()

    except requests.exceptions.Timeout:
        return "[Error] The request timed out."

    except requests.exceptions.ConnectionError:
        return "[Error] No internet connection."

    except Exception as e:
        return f"[Error] Something unexpected happened: {e}"


if __name__ == "__main__":
    print("Type your message and press Enter. Type 'quit' to stop.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        reply = send_message(user_input)
        print("AI:", reply)
        print()
        
