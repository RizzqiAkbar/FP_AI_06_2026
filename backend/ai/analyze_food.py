from ai.risk_score import calculate_risk_score
from ai.ingredient_checker import check_ingredients
from ai.gemini_service import get_gemini_analysis
from ai.recomendation import get_alternative_foods, generate_local_recommendation


def analyze_food(
    ocr_text,
    nutrition_data,
    user_profile,
    product_type="unknown"
):

    health_condition = user_profile.get(
        "health_condition",
        "normal"
    )
    goal = user_profile.get("goal", "general health")

    risk = calculate_risk_score(
        nutrition_data,
        health_condition
    )

    flagged = check_ingredients(
        ocr_text
    )

    ai_result = get_gemini_analysis(
        nutrition_data,
        user_profile,
        risk["score"],
        risk["risk_level"],
        flagged
    )

    alternatives = get_alternative_foods(
        product_type,
        health_condition
    )
    
    recommendation = generate_local_recommendation(
        risk["risk_level"],
        health_condition,
        goal
    )

    return {

        "nutrition_summary":
            nutrition_data,

        "risk_score":
            risk["score"],

        "risk_level":
            risk["risk_level"],

        "flagged_ingredients":
            flagged,

        "analysis":
            ai_result.get(
                "analysis",
                ""
            ),

        "recommendation":
            recommendation,

        "alternatives":
            alternatives
    }