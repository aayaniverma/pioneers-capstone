import os
import requests


# Set your OpenRouter API key here
API_KEY = "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"



def generate_output(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "https://yourdomain.com",  # Replace with your site or email
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistralai/mistral-7b-instruct",  # or "openchat/openchat-3.5-0106"
        "messages": [
            {"role": "system", "content": "You are a helpful legal document assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")
