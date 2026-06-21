import os
import re
import json
import google.generativeai as genai

from ai.prompts import get_analysis_prompt

def _sanitize_ocr_text(ocr_text: str, product_name: str = "") -> str:
    """Sanitize OCR text for Gemini by removing product and brand references."""
    cleaned = ocr_text or ""

    if product_name:
        pattern = re.compile(re.escape(product_name), re.IGNORECASE)
        cleaned = pattern.sub("this product", cleaned)

    # Remove obvious product/brand lines and references
    cleaned = re.sub(r"(?mi)^(product|brand|company|made by|distributed by)\s*[:\-].*$", "", cleaned)
    cleaned = re.sub(r"(?mi)^(as\s+a[n]?\s+ai|as\s+an\s+assistant|as\s+nutria\s+ai).*", "", cleaned)
    cleaned = re.sub(r"\n{2,}", "\n", cleaned)
    return cleaned.strip()

def get_gemini_analysis(
    parsed_nutrition,
    user_profile,
    risk_score,
    risk_level,
    flagged_ingredients
):

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {
            "error": "Missing GEMINI_API_KEY"
        }

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        "gemini-3.1-flash-lite"
    )

    prompt = get_analysis_prompt(
        parsed_nutrition,
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