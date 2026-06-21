from ai.risk_score import calculate_risk_score
from ai.ingredient_checker import check_ingredients
from ai.gemini_service import get_gemini_analysis
from ai.recomendation import get_alternative_foods


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

    risk = calculate_risk_score(
        nutrition_data,
        health_condition
    )

    flagged = check_ingredients(
        ocr_text
    )

    ai_result = get_gemini_analysis(
        ocr_text,
        user_profile,
        risk["score"],
        risk["risk_level"],
        flagged
    )

    alternatives = get_alternative_foods(
        product_type,
        health_condition
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
            ai_result.get(
                "recommendation",
                ""
            ),

        "alternatives":
            ai_result.get(
                "alternatives",
                alternatives
            )
    }