"I have used OpenRouter API"

import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
URL = "https://openrouter.ai/api/v1/chat/completions"


def send_message(user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openrouter/free",
        "messages": [
            {"role": "system", "content": "You are K2.OS, a personal basecamp AI. You help the user manage goals, tasks, and reflections. You are calm, direct, and supportive."},
            {"role": "user", "content": user_message}
        ]
    }

    try:
        response = requests.post(URL, headers=headers, json=payload, timeout=15)

        if response.status_code != 200:
            return f"[Error] API returned status {response.status_code}."

        data = response.json()
        choices = data.get("choices")
        if not choices:
            return "[Error] No response received."

        return choices[0]["message"]["content"].strip()

    except requests.exceptions.Timeout:
        return "[Error] Request timed out."
    except requests.exceptions.ConnectionError:
        return "[Error] No internet connection."
    except Exception as e:
        return f"[Error] {e}"


if __name__ == "__main__":
    print("Type your message. Type 'quit' to stop.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        print("AI:", send_message(user_input))
        print()
        