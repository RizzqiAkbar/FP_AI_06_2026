import os
import json
import google.generativeai as genai

from ai.prompts import get_analysis_prompt


def get_gemini_analysis(
    ocr_text,
    user_profile,
    risk_score,
    risk_level,
    flagged_ingredients
):

    api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key:
        return {
            "error": "Missing GEMINI_API_KEY"
        }

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

    prompt = get_analysis_prompt(
        ocr_text,
        user_profile,
        risk_score,
        risk_level,
        flagged_ingredients
    )

    try:

        response = model.generate_content(
            prompt
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:]

        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())

    except Exception as e:

        print(f"Gemini Error: {e}")

        return {
            "analysis":
                "Unable to generate analysis.",
            "recommendation":
                "Review nutrition information manually.",
            "alternatives": []
        }