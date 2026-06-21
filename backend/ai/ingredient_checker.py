RISKY_INGREDIENTS = [

    "high fructose corn syrup",

    "corn syrup",

    "msg",

    "monosodium glutamate",

    "sodium benzoate",

    "aspartame",

    "sucralose",

    "artificial flavor",

    "artificial colour",

    "artificial color"
]


def check_ingredients(text):

    text = text.lower()

    found = []

    for ingredient in RISKY_INGREDIENTS:

        if ingredient in text:
            found.append(ingredient)

    return found