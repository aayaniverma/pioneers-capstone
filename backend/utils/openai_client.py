import os
from dotenv import load_dotenv
import openai

# ✅ Load .env variables
load_dotenv()

# ✅ Secure API key
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")

# ✅ Configure OpenAI client for >= 1.0
client = openai.OpenAI(api_key=API_KEY)

def generate_output(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4",  # or "gpt-4.0", if needed
            messages=[
                {"role": "system", "content": "You are a helpful legal document assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"OpenAI API error: {e}")