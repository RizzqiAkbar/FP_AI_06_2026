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

    patterns = {
        "calories": [
            r"(?i)calories.*?(\d+)\s*(?:kcal|cal)",
            r"(?i)energ[iy].*?(\d+)\s*(?:kcal|cal|kj)",
            r"(?i)kal(?:ori)?.*?(\d+)\s*(?:kcal|cal)",
            r"(?i)calories[^\d]*(\d+)",
            r"(?i)energ[iy][^\d]*(\d+)",
            r"(?i)kal(?:ori)?[^\d]*(\d+)",
        ],
        "total_fat": [
            r"(?i)total\s*fat.*?(\d+\.?\d*)\s*g",
            r"(?i)lemak\s*total.*?(\d+\.?\d*)\s*g",
            r"(?i)fat.*?(\d+\.?\d*)\s*g",
            r"(?i)total\s*fat[^\d]*(\d+\.?\d*)",
        ],
        "saturated_fat": [
            r"(?i)saturated\s*fat.*?(\d+\.?\d*)\s*g",
            r"(?i)lemak\s*jenuh.*?(\d+\.?\d*)\s*g",
            r"(?i)saturated\s*fat[^\d]*(\d+\.?\d*)",
        ],
        "trans_fat": [
            r"(?i)trans\s*fat.*?(\d+\.?\d*)\s*g",
            r"(?i)lemak\s*trans.*?(\d+\.?\d*)\s*g",
            r"(?i)trans\s*fat[^\d]*(\d+\.?\d*)",
        ],
        "cholesterol": [
            r"(?i)cholesterol.*?(\d+\.?\d*)\s*mg",
            r"(?i)kolesterol.*?(\d+\.?\d*)\s*mg",
            r"(?i)cholesterol[^\d]*(\d+\.?\d*)",
        ],
        "sodium": [
            r"(?i)sodium.*?(\d+\.?\d*)\s*mg",
            r"(?i)natrium.*?(\d+\.?\d*)\s*mg",
            r"(?i)sodium[^\d]*(\d+\.?\d*)",
        ],
        "total_carbohydrate": [
            r"(?i)total\s*carbohydrate.*?(\d+\.?\d*)\s*g",
            r"(?i)karbohidrat\s*total.*?(\d+\.?\d*)\s*g",
            r"(?i)carbohydrate.*?(\d+\.?\d*)\s*g",
            r"(?i)total\s*carbohydrate[^\d]*(\d+\.?\d*)",
        ],
        "dietary_fiber": [
            r"(?i)dietary\s*fiber.*?(\d+\.?\d*)\s*g",
            r"(?i)serat\s*pangan.*?(\d+\.?\d*)\s*g",
            r"(?i)fiber.*?(\d+\.?\d*)\s*g",
            r"(?i)dietary\s*fiber[^\d]*(\d+\.?\d*)",
        ],
        "sugar": [
            r"(?i)sugars?.*?(\d+\.?\d*)\s*g",
            r"(?i)gula.*?(\d+\.?\d*)\s*g",
            r"(?i)total\s*sugars?.*?(\d+\.?\d*)\s*g",
            r"(?i)sugars?[^\d]*(\d+\.?\d*)",
        ],
        "protein": [
            r"(?i)protein.*?(\d+\.?\d*)\s*g",
            r"(?i)protein[^\d]*(\d+\.?\d*)",
        ],
        "serving_size": [
            r"(?i)serving\s*size.*?(\d+\.?\d*)\s*(?:g|ml|oz)",
            r"(?i)takaran\s*saji.*?(\d+\.?\d*)\s*(?:g|ml)",
            r"(?i)serving\s*size[^\d]*(\d+\.?\d*)",
        ],
    }

    for nutrient, regex_list in patterns.items():
        for pattern in regex_list:
            match = re.search(pattern, ocr_text)
            if match:
                val_str = match.group(1).replace(',', '')
                # Fix common OCR error: reading 'g' as '9' at the end of a number
                if val_str.endswith('9') and len(val_str) > 1 and '.' not in val_str:
                    # Only do this if it looks like a whole number that got a 9 appended
                    # e.g., 109 -> 10. But 9 -> 9.
                    val_str = val_str[:-1]
                
                try:
                    value = float(val_str)
                except ValueError:
                    continue

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
    ingredient_match = re.search(
        r"(?i)ingredients?[\s:;\-\.]*(.*?)(?:\n\n|\Z)",
        ocr_text,
        re.DOTALL,
    )

    if not ingredient_match:
        # Coba format Bahasa Indonesia
        ingredient_match = re.search(
            r"(?i)komposisi[\s:;\-\.]*(.*?)(?:\n\n|\Z)",
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
