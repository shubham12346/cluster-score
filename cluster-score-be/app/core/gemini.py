import requests
from app.core.config import settings

def get_gemini_response(prompt: str) -> tuple[str, str]:
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.gemini_api_key
    }

    body = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    # ✅ Use the correct model name here
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    res = requests.post(url, headers=headers, json=body)
    res.raise_for_status()

    text = res.json()["candidates"][0]["content"]["parts"][0]["text"]

    # You can optionally parse this further
    score = "N/A"
    lines = text.splitlines()
    for line in lines:
        if "score" in line.lower():
            score = line.split(":")[-1].strip()
            break

    return score, text
