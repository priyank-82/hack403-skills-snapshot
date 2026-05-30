import os
import requests

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = "enter_groq_api_key_here"  # Replace with your actual Groq API key

def chat_with_groq(messages, model="llama3-70b-8192", max_tokens=1024):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "max_tokens": max_tokens,
        "messages": messages
    }
    response = requests.post(GROQ_API_URL, headers=headers, json=data)
    response.raise_for_status()
    print(response.json())
    return response.json()["choices"][0]["message"]["content"] 