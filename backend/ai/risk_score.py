import re

def _parse_nutrient(value):
    """Safely parse nutrient value from string or number to float."""
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        match = re.search(r"(\d+(\.\d+)?)", value)
        if match:
            return float(match.group(1))
    return 0.0

def calculate_risk_score(nutrition_data, health_condition="normal"):
    score = 100
    
    # Extract nutrition values safely
    sugar = _parse_nutrient(nutrition_data.get("sugar", 0))
    sodium = _parse_nutrient(nutrition_data.get("sodium", 0))
    protein = _parse_nutrient(nutrition_data.get("protein", 0))
    fat = _parse_nutrient(nutrition_data.get("fat", 0))

    # General rules
    if sugar > 20:
        score -= 20
    elif sugar > 10:
        score -= 10

    if sodium > 500:
        score -= 15
    elif sodium > 300:
        score -= 10

    if protein < 5:
        score -= 10

    if fat > 20:
        score -= 10

    # Disease-aware rules
    health_condition = health_condition.lower()
    if health_condition == "diabetes":
        if sugar > 15:
            score -= 25
    elif health_condition == "hypertension":
        if sodium > 400:
            score -= 25
    elif health_condition == "cholesterol":
        if fat > 15:
            score -= 20
    elif health_condition == "gout":
        if protein > 15:
            score -= 20

    # Ensure score stays within 0-100
    score = max(0, min(100, score))

    # Determine risk level
    if score >= 80:
        risk_level = "Safe"
    elif score >= 50:
        risk_level = "Moderate Risk"
    else:
        risk_level = "High Risk"

    return {
        "score": score,
        "risk_level": risk_level
    }
