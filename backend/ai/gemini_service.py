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

def _generate_local_fallback_analysis(parsed_nutrition, risk_level, flagged_ingredients):
    """Generate a rule-based analysis string when Gemini is unavailable."""
    analysis = []
    analysis.append("Mode Offline Aktif. Analisis berikut dihasilkan oleh sistem lokal secara otomatis karena layanan AI sedang tidak tersedia.")
    
    if risk_level.lower() == "high" or "tinggi" in risk_level.lower():
        analysis.append("Berdasarkan profil Anda dan informasi nutrisi yang ditemukan, produk ini memiliki risiko tinggi untuk dikonsumsi. Harap perhatikan secara ekstra.")
    elif risk_level.lower() == "moderate" or "sedang" in risk_level.lower():
        analysis.append("Produk ini memiliki risiko sedang. Anda masih bisa mengonsumsinya namun dalam batas yang wajar.")
    else:
        analysis.append("Secara umum produk ini memiliki profil nutrisi yang aman untuk dikonsumsi dalam jumlah normal.")
        
    if flagged_ingredients:
        analysis.append(f"Perhatian khusus terhadap bahan berikut: {', '.join(flagged_ingredients)}. Bahan-bahan ini mungkin perlu dihindari tergantung kondisi kesehatan spesifik Anda.")
        
    if parsed_nutrition:
        cals = parsed_nutrition.get('calories')
        sugar = parsed_nutrition.get('sugar')
        if cals: analysis.append(f"Kalori produk ini adalah {cals}.")
        if sugar: analysis.append(f"Kandungan gula tercatat sebesar {sugar}.")
        
    return {"analysis": " ".join(analysis)}

def get_gemini_analysis(
    parsed_nutrition,
    user_profile,
    risk_score,
    risk_level,
    flagged_ingredients
):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("Missing GEMINI_API_KEY. Using local fallback.")
        return _generate_local_fallback_analysis(parsed_nutrition, risk_level, flagged_ingredients)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-3.1-flash-lite")

    prompt = get_analysis_prompt(
        parsed_nutrition,
        user_profile,
        risk_score,
        risk_level,
        flagged_ingredients
    )

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())

    except Exception as e:
        print(f"Gemini Error: {e}")
        return _generate_local_fallback_analysis(parsed_nutrition, risk_level, flagged_ingredients)


def get_gemini_multimodal_analysis(image_paths: dict, user_profile: dict) -> json:
    """
    Perform OCR and analysis in a single step using Gemini Multimodal (Vision) API.
    
    Args:
        image_paths: Dict containing keys like 'single', 'nutrition', 'ingredient', 'front'
                     with their respective absolute file paths.
        user_profile: Dict containing user info (age, weight, height, goal, conditions)
        
    Returns:
        Dict with keys: product_name, nutrition_data, ingredients, analysis.
        Returns None if API key is missing or call fails.
    """
    from PIL import Image
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Missing GEMINI_API_KEY. Cannot run Gemini Vision.")
        return None
        
    try:
        genai.configure(api_key=api_key)
        
        # We use gemini-1.5-flash for vision tasks as it is free-tier and extremely robust
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Load all valid image paths
        contents = []
        for key in sorted(image_paths.keys()):
            path = image_paths[key]
            if path and os.path.exists(path):
                img = Image.open(path)
                contents.append(img)
                
        if not contents:
            print("No valid images found for Gemini Vision.")
            return None
            
        # Build the prompt
        age = user_profile.get("age", "N/A")
        weight = user_profile.get("weight", "N/A")
        height = user_profile.get("height", "N/A")
        goal = user_profile.get("goal", "general health")
        
        # Normalize health conditions to a nice string
        conditions = user_profile.get("conditions", [])
        if not conditions:
            conditions = [user_profile.get("health_condition", "normal")]
        conditions_str = ", ".join(conditions) if isinstance(conditions, list) else str(conditions)
        
        prompt = f"""
Analyze the provided image(s) of a food product packaging (which may include nutrition facts, ingredients list, or front label).
Perform two tasks:
1. Extract the product name, nutrition facts values, and ingredients list.
2. Based on the user profile below, write a personalized nutrition analysis (2-3 paragraphs in Indonesian).

USER PROFILE:
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- Goal: {goal}
- Health Condition(s): {conditions_str}

CRITICAL RULES FOR PERSONALIZED ANALYSIS:
- Write the analysis in Indonesian.
- Explain the nutritional value of this product and its impact on the user based on their profile, goal, and health conditions.
- Do not mention specific product names, brand names, or company names in the analysis. Refer to the item only as "produk ini" or "produk tersebut".
- Do not use any introductory phrase like "Sebagai AI", "Sebagai Nutria AI", "Berdasarkan analisis saya", or similar. Start directly with the nutritional insight.

Return the result in the following JSON format:
{{
  "product_name": "Product Name (or empty string if not visible/detectable)",
  "nutrition_data": {{
    "calories": integer,
    "protein": float,
    "sugar": float,
    "fat": float,
    "total_fat": float,
    "saturated_fat": float,
    "trans_fat": float,
    "cholesterol": float,
    "sodium": float,
    "total_carbohydrate": float,
    "dietary_fiber": float,
    "serving_size": float
  }},
  "ingredients": ["ingredient1", "ingredient2", ...],
  "analysis": "The personalized nutrition explanation text in Indonesian."
}}

Ensure that "nutrition_data" values are numerical (floats/integers, e.g. 320 or 12.5), in standard units (calories in kcal, sodium/cholesterol in mg, others in g). Do not include units (like "g" or "mg") in the values. If any nutrition value is not found or not visible, set it to null or omit it.

Return ONLY the raw JSON string. Do not wrap it in markdown code blocks like ```json ``` or ```.
"""
        contents.append(prompt)
        response = model.generate_content(contents)
        text = response.text.strip()
        
        # Clean potential markdown wrapping if Gemini ignored the instruction
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        parsed = json.loads(text)
        return parsed
        
    except Exception as e:
        print(f"Gemini Multimodal Vision Error: {e}")
        return None