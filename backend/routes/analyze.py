import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.ocr_service import extract_text, extract_text_from_multiple
from services.parser_service import parse_nutrition, parse_ingredients, combine_ocr_results


analyze_bp = Blueprint("analyze", __name__)


def allowed_file(filename: str) -> bool:
    """Cek apakah file memiliki ekstensi yang diizinkan."""
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in current_app.config["ALLOWED_EXTENSIONS"]
    )


def save_upload(file, upload_folder: str) -> str:
    """
    Simpan file upload ke folder uploads dengan nama unik.

    Returns:
        Path lengkap ke file yang disimpan
    """
    filename = secure_filename(file.filename)
    # Tambah UUID untuk menghindari overwrite
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(upload_folder, unique_name)
    file.save(filepath)
    return filepath


@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Endpoint utama untuk analisis makanan.

    Menerima:
    - image (file): Gambar kemasan (single upload)
    - nutrition_image (file, optional): Gambar nutrition facts
    - ingredient_image (file, optional): Gambar ingredients list
    - front_image (file, optional): Gambar depan kemasan

    - age (form): Umur pengguna
    - weight (form): Berat badan (kg)
    - height (form): Tinggi badan (cm)
    - goal (form): Tujuan (cutting/bulking/maintain)
    - health_conditions (form): Kondisi kesehatan (comma-separated)

    Returns:
        JSON dengan ocr_text, nutrition_data, ingredients, user_profile, ocr_status
    """
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    saved_files = []  # Track untuk cleanup

    try:
        # === VALIDASI FILE ===
        has_single = "image" in request.files
        has_multi = any(
            key in request.files
            for key in ["nutrition_image", "ingredient_image", "front_image"]
        )

        if not has_single and not has_multi:
            return jsonify({"error": "Tidak ada gambar yang diupload"}), 400

        # === PROSES UPLOAD & OCR ===
        ocr_results = {}
        ocr_status = "success"

        if has_multi:
            # Multi-image upload
            image_keys = {
                "nutrition_image": "nutrition",
                "ingredient_image": "ingredient",
                "front_image": "front",
            }

            image_paths = {}
            for form_key, result_key in image_keys.items():
                if form_key in request.files:
                    file = request.files[form_key]
                    if file.filename and allowed_file(file.filename):
                        filepath = save_upload(file, upload_folder)
                        saved_files.append(filepath)
                        image_paths[result_key] = filepath
                    elif file.filename and not allowed_file(file.filename):
                        return jsonify(
                            {"error": f"Format file tidak didukung: {file.filename}"}
                        ), 400

            if not image_paths:
                return jsonify({"error": "Tidak ada file valid yang diupload"}), 400

            ocr_results = extract_text_from_multiple(image_paths)

            # Cek apakah semua OCR gagal (semua kosong)
            if all(not v for v in ocr_results.values()):
                ocr_status = "failed"

        else:
            # Single image upload
            file = request.files["image"]

            if not file.filename:
                return jsonify({"error": "Nama file kosong"}), 400

            if not allowed_file(file.filename):
                return jsonify(
                    {"error": f"Format file tidak didukung: {file.filename}. Gunakan: png, jpg, jpeg, webp, bmp, tiff"}
                ), 400

            filepath = save_upload(file, upload_folder)
            saved_files.append(filepath)

            text = extract_text(filepath)

            if not text:
                # OCR gagal — TIDAK crash, tetap kirim response dengan flag
                ocr_status = "failed"
                ocr_results = {"single": ""}
            else:
                ocr_results = {"single": text}

        # === PARSE DATA NUTRISI ===
        parsed_data = combine_ocr_results(ocr_results)

        # === AMBIL DATA PROFIL USER ===
        user_profile = {
            "age": request.form.get("age", type=int),
            "weight": request.form.get("weight", type=float),
            "height": request.form.get("height", type=float),
            "goal": request.form.get("goal", ""),
            "health_conditions": [
                c.strip()
                for c in request.form.get("health_conditions", "").split(",")
                if c.strip()
            ],
        }

        # === BUILD RESPONSE ===
        response = {
            "success": True,
            "ocr_status": ocr_status,
            "ocr_text": parsed_data["combined_text"],
            "nutrition_data": parsed_data["nutrition_data"],
            "ingredients": parsed_data["ingredients"],
            "product_name": parsed_data["product_name"],
            "user_profile": user_profile,
        }

        # Tambah pesan jika OCR gagal
        if ocr_status == "failed":
            response["message"] = (
                "Could not extract nutrition data from image. "
                "Please retake photo with better lighting and focus."
            )

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    finally:
        # Cleanup uploaded files
        for filepath in saved_files:
            try:
                if os.path.exists(filepath):
                    os.remove(filepath)
            except OSError:
                pass


@analyze_bp.route("/upload", methods=["POST"])
def upload():
    """
    Endpoint sederhana untuk upload gambar + OCR saja.
    Berguna untuk testing OCR tanpa profil user.

    Menerima:
    - image (file): Gambar kemasan

    Returns:
        JSON dengan ocr_text, nutrition_data, ocr_status
    """
    upload_folder = current_app.config["UPLOAD_FOLDER"]

    if "image" not in request.files:
        return jsonify({"error": "Tidak ada gambar yang diupload"}), 400

    file = request.files["image"]

    if not file.filename:
        return jsonify({"error": "Nama file kosong"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Format file tidak didukung"}), 400

    filepath = save_upload(file, upload_folder)

    try:
        # OCR
        text = extract_text(filepath)

        if not text:
            # Fallback: tetap response, tapi kasih flag gagal
            return jsonify({
                "success": True,
                "ocr_status": "failed",
                "ocr_text": "",
                "nutrition_data": {},
                "ingredients": [],
                "message": "Could not extract nutrition data from image. "
                           "Please retake photo with better lighting and focus.",
            }), 200

        # Parse
        nutrition_data = parse_nutrition(text)
        ingredients = parse_ingredients(text)

        return jsonify({
            "success": True,
            "ocr_status": "success",
            "ocr_text": text,
            "nutrition_data": nutrition_data,
            "ingredients": ingredients,
        }), 200

    except Exception as e:
        return jsonify({"error": f"OCR error: {str(e)}"}), 500

    finally:
        # Cleanup
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except OSError:
            pass


@analyze_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "NutriGuard AI Backend"}), 200
