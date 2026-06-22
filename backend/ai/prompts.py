def get_analysis_prompt(
    parsed_nutrition,
    user_profile,
    risk_score,
    risk_level,
    flagged_ingredients
):
    nutrition_summary_text = "None"
    if parsed_nutrition:
        summary_lines = []
        for key in ["calories", "protein", "sugar", "fat"]:
            if parsed_nutrition.get(key) is not None:
                summary_lines.append(f"- {key.capitalize()}: {parsed_nutrition.get(key)}")
        if summary_lines:
            nutrition_summary_text = "\n" + "\n".join(summary_lines)

    return f"""
Analyze the nutrition information below.
Give it in Indonesian
Do not mention product names, brand names, or company names.
Refer to the item only as "this product" or "the product".
Do not use any introduction such as "As Nutria AI", "As an AI", "I've analyzed", or similar.
Start directly with the nutritional insight.

PARSED NUTRITION SUMMARY:{nutrition_summary_text}

USER PROFILE:
Age: {user_profile.get('age', 'N/A')}
Weight: {user_profile.get('weight', 'N/A')} kg
Height: {user_profile.get('height', 'N/A')} cm
Goal: {user_profile.get('goal', 'N/A')}
Health Condition: {user_profile.get('health_condition', 'normal')}

PRE-CALCULATED HEALTH ASSESSMENT:
Risk Score: {risk_score}/100
Risk Level: {risk_level}

FLAGGED INGREDIENTS:
{', '.join(flagged_ingredients) if flagged_ingredients else 'None'}

Provide ONLY valid JSON with this exact structure:
{{
    "analysis": "1. Ringkasan\\n[1 kalimat ringkasan]\\n\\n2. Perhatian Utama\\n- [Poin 1]\\n- [Poin 2]\\n\\n3. Rekomendasi\\n[Saran singkat dan dapat ditindaklanjuti]\\n\\n4. Analisis Detail\\n[1 paragraf penjelasan spesifik berdasarkan profil pengguna]"
}}
"""

def get_multimodal_analysis_prompt(user_profile: dict) -> str:
    age = user_profile.get("age", "N/A")
    weight = user_profile.get("weight", "N/A")
    height = user_profile.get("height", "N/A")
    goal = user_profile.get("goal", "general health")
    
    # Normalize health conditions to a nice string
    conditions = user_profile.get("conditions", [])
    if not conditions:
        conditions = [user_profile.get("health_condition", "normal")]
    conditions_str = ", ".join(conditions) if isinstance(conditions, list) else str(conditions)
    
    return f"""
Analyze the provided image(s) of a food product packaging (which may include nutrition facts, ingredients list, or front label).
Perform two tasks:
1. Extract the product name, nutrition facts values, and ingredients list. IF the image does NOT contain any food product, nutrition panel, or ingredients list (e.g., it is a selfie, animal, landscape, or unrelated document), set "invalid_image" to true and leave other fields empty.
2. Based on the user profile below, write a personalized, concise nutrition analysis.

USER PROFILE:
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- Goal: {goal}
- Health Condition(s): {conditions_str}

CRITICAL RULES FOR PERSONALIZED ANALYSIS:
- Write the analysis in Indonesian.
- Keep it concise and structured EXACTLY with these sections: ### Ringkasan, ### Perhatian Utama, ### Rekomendasi, ### Analisis Detail Opsional.
- Explain the nutritional value of this product and its impact on the user based on their profile, goal, and health conditions.
- Do not mention specific product names, brand names, or company names in the analysis. Refer to the item only as "produk ini" or "produk tersebut".
- Do not use any introductory phrase like "Sebagai AI", "Sebagai Nutria AI", "Berdasarkan analisis saya", or similar. Start directly with the nutritional insight.

Return the result in the following JSON format:
{{
  "invalid_image": false,
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
  "analysis": "1. Ringkasan\\n...\\n\\n2. Perhatian Utama\\n...\\n\\n3. Rekomendasi\\n...\\n\\n4. Analisis Detail\\n..."
}}

Ensure that "nutrition_data" values are numerical (floats/integers, e.g. 320 or 12.5), in standard units (calories in kcal, sodium/cholesterol in mg, others in g). Do not include units (like "g" or "mg") in the values. If any nutrition value is not found or not visible, set it to null or omit it.

Return ONLY the raw JSON string. Do not wrap it in markdown code blocks like ```json ``` or ```.
"""