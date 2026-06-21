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
    "analysis": "Personalized explanation",
    "recommendation": "Provide a Safe to consume / Consume occasionally / Avoid, a personalized why, and a safe amount of consumption for this product (2-3 sentences) based on the user's profile and goals, avoiding repetition of the main analysis.",
    "alternatives": [
        "Alternative 1",
        "Alternative 2",
        "Alternative 3"
    ]
}}
"""