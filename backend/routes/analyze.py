import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.ocr_service import extract_text, extract_text_from_multiple
from services.parser_service import parse_nutrition, parse_ingredients, combine_ocr_results
from ai.gemini_service import get_gemini_analysis
from ai.risk_score import calculate_risk_score
from ai.ingredient_checker import check_ingredients
from ai.recomendation import get_alternative_foods

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
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    filepath = os.path.join(upload_folder, unique_name)
    file.save(filepath)
    return filepath


@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Endpoint utama untuk analisis makanan.
    """
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    saved_files = []

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

            if all(not v for v in ocr_results.values()):
                ocr_status = "failed"

        else:
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
                ocr_status = "failed"
                ocr_results = {"single": ""}
            else:
                ocr_results = {"single": text}

        # === PARSE DATA NUTRISI ===
        parsed_data = combine_ocr_results(ocr_results)

        # === AMBIL DATA PROFIL USER ===
        user_profile = {
            "age": request.form.get("age", type=int) or "N/A",
            "weight": request.form.get("weight", type=float) or "N/A",
            "height": request.form.get("height", type=float) or "N/A",
            "goal": request.form.get("goal", ""),
            "health_conditions": [
                c.strip()
                for c in request.form.get("health_conditions", "").split(",")
                if c.strip()
            ],
        }
        
        # Format for risk score (needs a single string representing condition, or default normal)
        health_cond_str = "normal"
        if user_profile["health_conditions"]:
            health_cond_str = user_profile["health_conditions"][0]

        # === AI INTEGRATION ===
        risk = calculate_risk_score(parsed_data.get("nutrition_data", {}), health_cond_str)
        flagged = check_ingredients(parsed_data.get("combined_text", ""))
        
        ai_result = get_gemini_analysis(
            parsed_data.get("combined_text", ""),
            user_profile,
            risk["score"],
            risk["risk_level"],
            flagged
        )
        
        alternatives = get_alternative_foods(
            parsed_data.get("product_name", "unknown"),
            health_cond_str
        )

        # === BUILD RESPONSE ===
        response = {
            "success": True,
            "ocr_status": ocr_status,
            "ocr_text": parsed_data.get("combined_text", ""),
            "nutrition_data": parsed_data.get("nutrition_data", {}),
            "ingredients": parsed_data.get("ingredients", []),
            "product_name": parsed_data.get("product_name", ""),
            "user_profile": user_profile,
            "risk_score": risk["score"],
            "risk_level": risk["risk_level"],
            "flagged_ingredients": flagged,
            "analysis": ai_result.get("analysis", ""),
            "recommendation": ai_result.get("recommendation", ""),
            "alternatives": ai_result.get("alternatives", alternatives)
        }

        if ocr_status == "failed":
            response["message"] = (
                "Could not extract nutrition data from image. "
                "Please retake photo with better lighting and focus."
            )

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    finally:
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
        text = extract_text(filepath)

        if not text:
            return jsonify({
                "success": True,
                "ocr_status": "failed",
                "ocr_text": "",
                "nutrition_data": {},
                "ingredients": [],
                "message": "Could not extract nutrition data from image.",
            }), 200

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
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except OSError:
            pass


@analyze_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "NutriGuard AI Backend"}), 200
