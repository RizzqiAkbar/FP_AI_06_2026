"""Utility functions for input validation."""

ALLOWED_GOALS = ["cutting", "bulking", "maintain", "general"]
ALLOWED_CONDITIONS = [
    "diabetes",
    "hipertensi",
    "kolesterol",
    "asam_urat",
    "obesity",
    "none",
]


def validate_user_profile(profile: dict) -> tuple[bool, str]:
    """
    Validasi data profil user.

    Args:
        profile: Dict berisi age, weight, height, goal, health_conditions

    Returns:
        Tuple (is_valid, error_message)
    """
    # Age validation
    age = profile.get("age")
    if age is not None:
        if not isinstance(age, int) or age < 1 or age > 150:
            return False, "Umur harus antara 1-150 tahun"

    # Weight validation
    weight = profile.get("weight")
    if weight is not None:
        if not isinstance(weight, (int, float)) or weight < 1 or weight > 500:
            return False, "Berat badan harus antara 1-500 kg"

    # Height validation
    height = profile.get("height")
    if height is not None:
        if not isinstance(height, (int, float)) or height < 30 or height > 300:
            return False, "Tinggi badan harus antara 30-300 cm"

    # Goal validation
    goal = profile.get("goal", "")
    if goal and goal.lower() not in ALLOWED_GOALS:
        return False, f"Goal harus salah satu dari: {', '.join(ALLOWED_GOALS)}"

    return True, ""
