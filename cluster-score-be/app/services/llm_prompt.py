# app/services/llm.py

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

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

    res = requests.post(url, headers=headers, json=body)

    # Good to inspect this if it fails
    if not res.ok:
        print("Response Text:", res.text)
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
