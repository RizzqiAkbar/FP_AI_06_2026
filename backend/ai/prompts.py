def get_analysis_prompt(
    ocr_text,
    user_profile,
    risk_score,
    risk_level,
    flagged_ingredients
):
    return f"""
You are Nutrify AI, an expert nutritionist and health advisor.

Analyze this food product based on:

FOOD INFORMATION:
{ocr_text}

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

Provide response in JSON format only:

{{
    "analysis": "Personalized explanation",
    "recommendation": "Consume, Limit, or Avoid",
    "alternatives": [
        "Alternative 1",
        "Alternative 2",
        "Alternative 3"
    ]
}}

Return ONLY valid JSON.
"""