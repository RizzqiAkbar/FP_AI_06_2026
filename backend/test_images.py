"""
Test OCR — otomatis scan semua gambar di folder 'test ocr/'.
Tinggal tambah gambar baru ke folder, jalankan ulang script ini.

Usage:
    python test_images.py
"""
import requests
import os
import glob

UPLOAD_URL = "http://localhost:5000/api/upload"
TEST_FOLDER = "test ocr"
SUPPORTED_EXT = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff")


def test_image(filepath):
    """Kirim satu gambar ke API dan tampilkan hasilnya."""
    filename = os.path.basename(filepath)
    print(f"\n{'='*50}")
    print(f"  {filename}")
    print("=" * 50)

    with open(filepath, "rb") as f:
        resp = requests.post(
            UPLOAD_URL,
            files={"image": (filename, f, "image/jpeg")},
        )

    data = resp.json()
    print(f"Status: {resp.status_code} | OCR Status: {data.get('ocr_status')}")
    print(f"\n--- OCR Text ---")
    print(data.get("ocr_text", "N/A")[:600])
    print(f"\n--- Parsed Nutrition ---")
    nutrition = data.get("nutrition_data", {})
    if nutrition:
        for key, val in nutrition.items():
            print(f"  {key}: {val}")
    else:
        print("  (kosong)")

    ingredients = data.get("ingredients", [])
    if ingredients:
        print(f"\n--- Ingredients ---")
        print(f"  {', '.join(ingredients)}")

    if data.get("message"):
        print(f"\n⚠️  {data['message']}")

    return nutrition


def main():
    # Cari semua gambar di folder test
    images = sorted(
        [f for f in glob.glob(os.path.join(TEST_FOLDER, "*")) if f.lower().endswith(SUPPORTED_EXT)]
    )

    if not images:
        print(f"Tidak ada gambar di folder '{TEST_FOLDER}/'")
        print(f"Taruh file gambar (.jpg/.png/.webp) di folder tersebut.")
        return

    print(f"Ditemukan {len(images)} gambar di '{TEST_FOLDER}/'")

    all_results = {}
    for img_path in images:
        nutrition = test_image(img_path)
        all_results[os.path.basename(img_path)] = nutrition

    # Summary
    print(f"\n\n{'='*50}")
    print("  SUMMARY")
    print("=" * 50)
    for name, nutrition in all_results.items():
        count = len(nutrition)
        print(f"  {name}: {count} nutrisi terparsing")


if __name__ == "__main__":
    main()
