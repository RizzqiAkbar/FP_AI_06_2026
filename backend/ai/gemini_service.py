import os
import google.generativeai as genai
import json
from ai.prompts import get_analysis_prompt

def get_gemini_analysis(ocr_text, user_profile):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return {"error": "Invalid or missing GEMINI_API_KEY"}

    genai.configure(api_key=api_key)
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = get_analysis_prompt(ocr_text, user_profile)
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        # Clean up Markdown JSON blocks if present
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "error": "Failed to analyze food. Please try again."
        }
