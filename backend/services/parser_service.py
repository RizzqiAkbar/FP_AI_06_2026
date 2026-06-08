import re
from typing import Optional


def parse_nutrition(ocr_text: str) -> dict:
    """
    Parse teks OCR untuk mengekstrak data nutrisi.

    Mendukung format:
    - "Calories 320"
    - "Calories: 320"
    - "Total Fat 12g"
    - "Sugars 28 g"
    - "Sodium 450 mg"

    Args:
        ocr_text: Teks mentah dari OCR

    Returns:
        Dictionary berisi data nutrisi yang berhasil diparsing
    """
    nutrition_data = {}

    # Definisikan pattern untuk setiap nutrisi
    patterns = {
        "calories": [
            r"[Cc]alories\s*[:\s]*(\d+)",
            r"[Ee]nerg[iy]\s*[:\s]*(\d+)",
            r"[Kk]al(?:ori)?\s*[:\s]*(\d+)",
        ],
        "total_fat": [
            r"[Tt]otal\s*[Ff]at\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ll]emak\s*[Tt]otal\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ff]at\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "saturated_fat": [
            r"[Ss]aturated\s*[Ff]at\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ll]emak\s*[Jj]enuh\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "trans_fat": [
            r"[Tt]rans\s*[Ff]at\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ll]emak\s*[Tt]rans\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "cholesterol": [
            r"[Cc]holesterol\s*[:\s]*(\d+\.?\d*)\s*mg",
            r"[Kk]olesterol\s*[:\s]*(\d+\.?\d*)\s*mg",
        ],
        "sodium": [
            r"[Ss]odium\s*[:\s]*(\d+\.?\d*)\s*mg",
            r"[Nn]atrium\s*[:\s]*(\d+\.?\d*)\s*mg",
        ],
        "total_carbohydrate": [
            r"[Tt]otal\s*[Cc]arbohydrate\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Kk]arbohidrat\s*[Tt]otal\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Cc]arbohydrate\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "dietary_fiber": [
            r"[Dd]ietary\s*[Ff]iber\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ss]erat\s*[Pp]angan\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Ff]iber\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "sugar": [
            r"[Ss]ugars?\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Gg]ula\s*[:\s]*(\d+\.?\d*)\s*g",
            r"[Tt]otal\s*[Ss]ugars?\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "protein": [
            r"[Pp]rotein\s*[:\s]*(\d+\.?\d*)\s*g",
        ],
        "serving_size": [
            r"[Ss]erving\s*[Ss]ize\s*[:\s]*(\d+\.?\d*)\s*(?:g|ml|oz)",
            r"[Tt]akaran\s*[Ss]aji\s*[:\s]*(\d+\.?\d*)\s*(?:g|ml)",
        ],
    }

    for nutrient, regex_list in patterns.items():
        for pattern in regex_list:
            match = re.search(pattern, ocr_text)
            if match:
                value = float(match.group(1).replace(',', ''))
                # Calories biasanya integer
                if nutrient == "calories":
                    value = int(value)

                # Normalize total fat to fat for frontend consistency
                if nutrient == "total_fat":
                    nutrition_data["fat"] = value
                    nutrition_data["total_fat"] = value
                else:
                    nutrition_data[nutrient] = value
                break  # Ambil match pertama yang berhasil

    return nutrition_data


def parse_ingredients(ocr_text: str) -> list:
    """
    Parse teks OCR untuk mengekstrak daftar bahan (ingredients).

    Args:
        ocr_text: Teks mentah dari OCR

    Returns:
        List berisi nama-nama bahan
    """
    ingredients = []

    # Cari bagian ingredients
    # Pattern: "Ingredients:" atau "INGREDIENTS:" diikuti daftar
    ingredient_match = re.search(
        r"[Ii]ngredients?\s*[:\s]*(.*?)(?:\n\n|\Z)",
        ocr_text,
        re.DOTALL,
    )

    if not ingredient_match:
        # Coba format Bahasa Indonesia
        ingredient_match = re.search(
            r"[Kk]omposisi\s*[:\s]*(.*?)(?:\n\n|\Z)",
            ocr_text,
            re.DOTALL,
        )

    if ingredient_match:
        raw_text = ingredient_match.group(1).strip()
        # Split by comma, semicolon, atau bullet
        items = re.split(r"[,;•·]", raw_text)
        ingredients = [item.strip().rstrip(".") for item in items if item.strip()]

    return ingredients


def combine_ocr_results(ocr_results: dict) -> dict:
    """
    Gabungkan hasil OCR dari multiple gambar menjadi satu data terstruktur.

    Args:
        ocr_results: Dict berisi teks OCR per tipe gambar
                     {"nutrition": "...", "ingredient": "...", "front": "..."}

    Returns:
        Dict berisi nutrition_data, ingredients, product_name, dan combined_text
    """
    combined_text = ""
    nutrition_data = {}
    ingredients = []
    product_name = ""

    # Parse nutrition facts
    if "nutrition" in ocr_results and ocr_results["nutrition"]:
        nutrition_text = ocr_results["nutrition"]
        combined_text += f"[Nutrition Facts]\n{nutrition_text}\n\n"
        nutrition_data = parse_nutrition(nutrition_text)

    # Parse ingredients
    if "ingredient" in ocr_results and ocr_results["ingredient"]:
        ingredient_text = ocr_results["ingredient"]
        combined_text += f"[Ingredients]\n{ingredient_text}\n\n"
        ingredients = parse_ingredients(ingredient_text)

    # Front label (untuk nama produk)
    if "front" in ocr_results and ocr_results["front"]:
        front_text = ocr_results["front"]
        combined_text += f"[Front Label]\n{front_text}\n\n"
        # Baris pertama biasanya nama produk
        lines = [l.strip() for l in front_text.split("\n") if l.strip()]
        if lines:
            product_name = lines[0]

    # Fallback: jika hanya ada satu gambar (single upload)
    if not combined_text and "single" in ocr_results:
        single_text = ocr_results["single"]
        combined_text = single_text
        nutrition_data = parse_nutrition(single_text)
        ingredients = parse_ingredients(single_text)

    return {
        "nutrition_data": nutrition_data,
        "ingredients": ingredients,
        "product_name": product_name,
        "combined_text": combined_text.strip() if combined_text else "",
    }
