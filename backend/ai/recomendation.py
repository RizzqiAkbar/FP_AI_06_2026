def get_alternative_foods(product_type, health_condition="normal"):
    """
    Returns a list of healthy alternative foods based on the product type and user's health condition.
    """
    product_type = product_type.lower() if product_type else "unknown"
    health_condition = health_condition.lower() if health_condition else "normal"

    alternatives = []

    if "drink" in product_type or "soda" in product_type or "beverage" in product_type:
        alternatives = ["Water", "Unsweetened Tea", "Sparkling Water with Lemon"]
        if health_condition == "diabetes":
            alternatives.append("Diet or Zero Sugar beverages")
            
    elif "snack" in product_type or "chips" in product_type:
        alternatives = ["Mixed Nuts", "Air-popped Popcorn", "Roasted Chickpeas"]
        if health_condition == "hypertension":
            alternatives = ["Unsalted Mixed Nuts", "Fresh Fruit slices", "Carrot sticks with Hummus"]
            
    elif "sweet" in product_type or "candy" in product_type or "chocolate" in product_type:
        alternatives = ["Fresh Fruits", "Dark Chocolate (70%+ cocoa)"]
        if health_condition == "diabetes":
            alternatives = ["Berries", "Greek Yogurt with Cinnamon"]

    elif "noodle" in product_type or "pasta" in product_type:
        alternatives = ["Whole Wheat Pasta", "Zucchini Noodles (Zoodles)", "Shirataki Noodles"]
        
    else:
        # Generic alternatives for unknown or general types
        alternatives = ["Fresh Fruits", "Vegetable Sticks", "Greek Yogurt", "Nuts and Seeds"]

    return alternatives

def generate_local_recommendation(risk_level, health_condition="normal", goal="general health"):
    """
    Generate a recommendation locally based on risk level and user profile.
    """
    risk = risk_level.lower()
    
    if "high" in risk or "tinggi" in risk:
        rec = "Sangat disarankan untuk menghindari produk ini atau konsumsi dalam jumlah yang sangat terbatas."
        if health_condition != "normal":
            rec += f" Terutama karena Anda memiliki kondisi {health_condition}, produk ini dapat memperburuk kondisi Anda."
    elif "moderate" in risk or "medium" in risk or "sedang" in risk:
        rec = "Produk ini bisa dikonsumsi sesekali dalam porsi wajar, namun jangan dijadikan konsumsi harian utama."
        if goal == "weight_loss" or goal == "menurunkan berat badan":
            rec += " Perhatikan porsi konsumsi agar target penurunan berat badan tetap tercapai."
    else:
        rec = "Produk ini tergolong aman untuk dikonsumsi dalam batas wajar sesuai anjuran porsi."
        
    return rec
