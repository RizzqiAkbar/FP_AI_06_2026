import pytesseract
from PIL import Image
import numpy as np
from config import Config
from services.img_preprocess import preprocess_image, preprocess_image_simple

# Set Tesseract command path
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD

# Custom Tesseract config untuk nutrition facts (tabel/block text)
# --oem 3: Default OCR Engine Mode (LSTM + Legacy combined)
# --psm 6: Assume a single uniform block of text (cocok untuk nutrition facts)
TESSERACT_CONFIG_BLOCK = r"--oem 3 --psm 6"

# Config untuk single line (berguna untuk front label / nama produk)
TESSERACT_CONFIG_LINE = r"--oem 3 --psm 7"

# Config default (auto-detect layout)
TESSERACT_CONFIG_AUTO = r"--oem 3 --psm 3"


def extract_text(image_path: str, lang: str = "eng+ind") -> str:
    """
    Ekstrak teks dari gambar menggunakan Tesseract OCR.

    Strategi multi-pass:
    1. Advanced preprocessing + psm 6 (block text - nutrition facts)
    2. Simple preprocessing + psm 3 (auto layout)
    3. Direct image + psm 6 (tanpa preprocessing)
    4. Direct image + psm 3 (fallback paling basic)

    Pilih hasil yang paling panjang (paling banyak teks terbaca).

    Args:
        image_path: Path ke file gambar
        lang: Bahasa OCR (default: eng, bisa: ind, eng+ind)

    Returns:
        Teks hasil OCR (bisa kosong string jika semua gagal)
    """
    results = []

    try:
        # Pass 1: Advanced preprocessing + block text config
        processed_img = preprocess_image(image_path)
        text = pytesseract.image_to_string(
            Image.fromarray(processed_img), lang=lang, config=TESSERACT_CONFIG_BLOCK
        )
        results.append(text)
    except Exception:
        pass

    try:
        # Pass 2: Simple preprocessing + auto config
        processed_simple = preprocess_image_simple(image_path)
        text = pytesseract.image_to_string(
            Image.fromarray(processed_simple), lang=lang, config=TESSERACT_CONFIG_AUTO
        )
        results.append(text)
    except Exception:
        pass

    try:
        # Pass 3: Direct image + block text config
        text = pytesseract.image_to_string(
            Image.open(image_path), lang=lang, config=TESSERACT_CONFIG_BLOCK
        )
        results.append(text)
    except Exception:
        pass

    try:
        # Pass 4: Direct image + auto config (most permissive)
        text = pytesseract.image_to_string(
            Image.open(image_path), lang=lang, config=TESSERACT_CONFIG_AUTO
        )
        results.append(text)
    except Exception:
        pass

    if not results:
        # Semua pass gagal
        return ""

    # Pilih hasil terbaik (paling banyak teks terbaca)
    best_text = max(results, key=lambda t: len(t.strip()))
    return best_text.strip()


def extract_text_from_multiple(image_paths: dict, lang: str = "eng+ind") -> dict:
    """
    Ekstrak teks dari beberapa gambar (multi-image support).

    Args:
        image_paths: Dict dengan key = tipe gambar, value = path file
                     Contoh: {"nutrition": "path1.jpg", "ingredient": "path2.jpg"}
        lang: Bahasa OCR

    Returns:
        Dict dengan key = tipe gambar, value = teks hasil OCR
        (value kosong "" jika OCR gagal untuk gambar tersebut)
    """
    results = {}

    for image_type, path in image_paths.items():
        if path:
            results[image_type] = extract_text(path, lang)

    return results
