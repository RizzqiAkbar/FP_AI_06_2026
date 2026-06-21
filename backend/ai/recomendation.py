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
