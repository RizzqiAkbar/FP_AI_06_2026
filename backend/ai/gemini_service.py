import os
import re
import json
import google.generativeai as genai

from ai.prompts import get_analysis_prompt, get_multimodal_analysis_prompt

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

    prompt = get_analysis_prompt(
        parsed_nutrition,
        user_profile,
        risk_score,
        risk_level,
        flagged_ingredients
    )

    models_to_try = ["gemini-3.1-flash-lite", "gemini-2.5-flash-lite"]

    try:
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                text = response.text.strip()

                if text.startswith("```json"):
                    text = text[7:]
                if text.endswith("```"):
                    text = text[:-3]

                return json.loads(text.strip())

            except Exception as e:
                print(f"Gemini Error with {model_name}: {e}")
                error = str(e)

                if (
                    "RESOURCE_EXHAUSTED" in error
                    or "429" in error
                    or "quota" in error.lower()
                    or "rate limit" in error.lower()
                ):
                    continue

                raise
    except Exception as final_e:
        print(f"Non-retriable Gemini error or fallback trigger: {final_e}")

    print("Gemini models failed. Using local fallback.")
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
        prompt = get_multimodal_analysis_prompt(user_profile)
        contents.append(prompt)
        
        models_to_try = ["gemini-3.1-flash-lite", "gemini-2.5-flash-lite"]
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
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
                print(f"Gemini Multimodal Vision Error with {model_name}: {e}")
                error = str(e)

                if (
                    "RESOURCE_EXHAUSTED" in error
                    or "429" in error
                    or "quota" in error.lower()
                    or "rate limit" in error.lower()
                ):
                    continue

                raise
                
        print("All Gemini Vision models failed. Falling back.")
        return None
        
    except Exception as e:
        print(f"Unexpected error in get_gemini_multimodal_analysis: {e}")
        return None