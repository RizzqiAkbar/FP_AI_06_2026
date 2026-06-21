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
        # === VALIDASI & SIMPAN FILE ===
        has_single = "image" in request.files
        has_multi = any(
            key in request.files
            for key in ["nutrition_image", "ingredient_image", "front_image"]
        )

        if not has_single and not has_multi:
            return jsonify({"error": "Tidak ada gambar yang diupload"}), 400

        image_paths = {}

        if has_multi:
            image_keys = {
                "nutrition_image": "nutrition",
                "ingredient_image": "ingredient",
                "front_image": "front",
            }

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
            image_paths = {"single": filepath}

        # === AMBIL DATA PROFIL USER ===
        import json
        user_profile_str = request.form.get("user_profile", "{}")
        try:
            user_profile = json.loads(user_profile_str)
        except Exception:
            user_profile = {}
        
        health_cond_str = "normal"
        conditions = user_profile.get("conditions", [])
        if conditions and len(conditions) > 0:
            health_cond_str = conditions[0]
        else:
            # Fallback to single condition string in case user profile is structured differently
            health_cond_str = user_profile.get("health_condition", "normal")

        # === CHECK CACHE FIRST (BY IMAGE HASH) ===
        from utils.cache import (
            calculate_multiple_files_hash, 
            generate_image_cache_key, 
            get_cached_analysis, 
            set_cached_analysis
        )
        
        image_hash = calculate_multiple_files_hash(image_paths)
        cache_key = generate_image_cache_key(image_hash, user_profile)
        cached_result = get_cached_analysis(cache_key)
        
        if cached_result and isinstance(cached_result, dict) and "analysis" in cached_result:
            print("[analyze] Cache hit (image hash). Returning cached results.")
            return jsonify({
                "success": True,
                "ocr_status": cached_result.get("ocr_status", "success"),
                "ocr_text": cached_result.get("ocr_text", ""),
                "product_name": cached_result.get("product_name", ""),
                "user_profile": user_profile,
                "analysis": cached_result.get("analysis")
            }), 200

        # === PROSES UTAMA: GEMINI VISION ===
        from ai.gemini_service import get_gemini_multimodal_analysis
        
        ocr_status = "success"
        ocr_text = ""
        product_name = ""
        nutrition_data = {}
        ingredients = []
        analysis_text = ""
        
        gemini_vision_res = None
        if os.getenv("GEMINI_API_KEY"):
            print("[analyze] Attempting Gemini Multimodal Vision analysis...")
            gemini_vision_res = get_gemini_multimodal_analysis(image_paths, user_profile)
            
        if gemini_vision_res:
            print("[analyze] Gemini Vision analysis successful.")
            product_name = gemini_vision_res.get("product_name", "")
            nutrition_data = gemini_vision_res.get("nutrition_data", {}) or {}
            ingredients = gemini_vision_res.get("ingredients", []) or []
            analysis_text = gemini_vision_res.get("analysis", "")
            
            # Reconstruct combined OCR text from nutrition_data and ingredients for frontend display
            lines = []
            if product_name:
                lines.append(f"Product Name: {product_name}")
            if nutrition_data:
                lines.append("\n[Nutrition Facts]")
                for k, v in nutrition_data.items():
                    lines.append(f"{k}: {v}")
            if ingredients:
                lines.append("\n[Ingredients]")
                lines.append(", ".join(ingredients))
            ocr_text = "\n".join(lines)
        else:
            # === FALLBACK: TESSERACT + LOCAL PARSER ===
            print("[analyze] Gemini Vision unavailable or failed. Falling back to local Tesseract OCR...")
            
            if has_multi:
                ocr_results = extract_text_from_multiple(image_paths)
                if all(not v for v in ocr_results.values()):
                    ocr_status = "failed"
            else:
                text = extract_text(image_paths.get("single", ""))
                if not text:
                    ocr_status = "failed"
                    ocr_results = {"single": ""}
                else:
                    ocr_results = {"single": text}
            
            parsed_data = combine_ocr_results(ocr_results)
            ocr_text = parsed_data.get("combined_text", "")
            product_name = parsed_data.get("product_name", "")
            nutrition_data = parsed_data.get("nutrition_data", {})
            ingredients = parsed_data.get("ingredients", [])
            
            # Run text-only analysis via Gemini (or local fallback)
            risk = calculate_risk_score(nutrition_data, health_cond_str)
            flagged = check_ingredients(ocr_text)
            
            ai_result = get_gemini_analysis(
                nutrition_data,
                user_profile,
                risk["score"],
                risk["risk_level"],
                flagged
            )
            analysis_text = ai_result.get("analysis", "")

        # === DETERMINISTIC LOCAL CALCULATIONS ===
        risk = calculate_risk_score(nutrition_data, health_cond_str)
        
        # If ingredients list is a list, join it
        ingredients_str = ", ".join(ingredients) if isinstance(ingredients, list) else str(ingredients)
        flagged = check_ingredients(ingredients_str or ocr_text)
        
        alternatives = get_alternative_foods(
            product_name or "unknown",
            health_cond_str
        )
        
        from ai.recomendation import generate_local_recommendation
        recommendation = generate_local_recommendation(
            risk["risk_level"], 
            health_cond_str, 
            user_profile.get("goal", "general health")
        )
        
        # === BUILD RESPONSE & SAVE CACHE ===
        analysis_section = {
            "nutrition_summary": nutrition_data,
            "risk_score": risk["score"],
            "risk_level": risk["risk_level"],
            "flagged_ingredients": flagged,
            "analysis": analysis_text,
            "recommendation": recommendation,
            "alternatives": alternatives
        }
        
        # If there was an error in fallback ai_result, keep it
        if not gemini_vision_res and 'ai_result' in locals() and isinstance(ai_result, dict) and ai_result.get("error"):
            analysis_section["error"] = ai_result.get("error")

        response_payload = {
            "ocr_status": ocr_status,
            "ocr_text": ocr_text,
            "product_name": product_name,
            "analysis": analysis_section
        }
        
        set_cached_analysis(cache_key, response_payload)
        
        response = {
            "success": True,
            "ocr_status": ocr_status,
            "ocr_text": ocr_text,
            "product_name": product_name,
            "user_profile": user_profile,
            "analysis": analysis_section
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
    image_paths = {"single": filepath}

    try:
        # Load user profile from request if present
        import json
        user_profile = {}
        try:
            user_profile_str = request.form.get("user_profile", "")
            if user_profile_str:
                user_profile = json.loads(user_profile_str)
        except Exception:
            user_profile = {}

        # Pre-cache check by image hash
        from utils.cache import (
            calculate_multiple_files_hash, 
            generate_image_cache_key, 
            get_cached_analysis, 
            set_cached_analysis
        )
        
        image_hash = calculate_multiple_files_hash(image_paths)
        cache_key = generate_image_cache_key(image_hash, user_profile)
        cached_result = get_cached_analysis(cache_key)

        # Determine if we need to run AI
        run_ai = request.form.get("ai", "false").lower() == "true" or bool(user_profile)

        # If cache hit and format matches
        if cached_result and isinstance(cached_result, dict):
            # If they asked for AI and cache contains analysis, OR they didn't ask for AI
            has_cached_analysis = "analysis" in cached_result
            if (run_ai and has_cached_analysis) or (not run_ai):
                print("[upload] Cache hit. Returning cached results.")
                response = {
                    "success": True,
                    "ocr_status": cached_result.get("ocr_status", "success"),
                    "ocr_text": cached_result.get("ocr_text", ""),
                    "nutrition_data": cached_result.get("analysis", {}).get("nutrition_summary", {}) if has_cached_analysis else cached_result.get("nutrition_data", {}),
                    "ingredients": cached_result.get("analysis", {}).get("flagged_ingredients", []) if has_cached_analysis else cached_result.get("ingredients", []),
                }
                if run_ai and has_cached_analysis:
                    response["analysis"] = cached_result.get("analysis")
                return jsonify(response), 200

        # Run vision analysis first if Gemini API is available
        ocr_status = "success"
        ocr_text = ""
        product_name = ""
        nutrition_data = {}
        ingredients = []
        ai_section = None

        from ai.gemini_service import get_gemini_multimodal_analysis
        
        gemini_vision_res = None
        if os.getenv("GEMINI_API_KEY"):
            print("[upload] Attempting Gemini Multimodal Vision analysis...")
            gemini_vision_res = get_gemini_multimodal_analysis(image_paths, user_profile)

        if gemini_vision_res:
            print("[upload] Gemini Vision successful.")
            product_name = gemini_vision_res.get("product_name", "")
            nutrition_data = gemini_vision_res.get("nutrition_data", {}) or {}
            ingredients = gemini_vision_res.get("ingredients", []) or []
            analysis_text = gemini_vision_res.get("analysis", "")
            
            # Reconstruct OCR text
            lines = []
            if product_name:
                lines.append(f"Product Name: {product_name}")
            if nutrition_data:
                lines.append("\n[Nutrition Facts]")
                for k, v in nutrition_data.items():
                    lines.append(f"{k}: {v}")
            if ingredients:
                lines.append("\n[Ingredients]")
                lines.append(", ".join(ingredients))
            ocr_text = "\n".join(lines)
            
            if run_ai:
                health_cond_str = user_profile.get("conditions", ["normal"])[0] if user_profile else "normal"
                risk = calculate_risk_score(nutrition_data, health_cond_str)
                flagged = check_ingredients(", ".join(ingredients))
                
                from ai.recomendation import generate_local_recommendation
                recommendation = generate_local_recommendation(
                    risk["risk_level"], 
                    health_cond_str, 
                    user_profile.get("goal", "general health") if user_profile else "general health"
                )
                
                ai_section = {
                    "nutrition_summary": nutrition_data,
                    "risk_score": risk["score"],
                    "risk_level": risk["risk_level"],
                    "flagged_ingredients": flagged,
                    "analysis": analysis_text,
                    "recommendation": recommendation,
                    "alternatives": get_alternative_foods(product_name or "unknown", health_cond_str),
                }
        else:
            # Fallback to Tesseract
            print("[upload] Gemini Vision failed/unavailable. Falling back to local Tesseract OCR...")
            ocr_text = extract_text(filepath)
            if not ocr_text:
                ocr_status = "failed"
            nutrition_data = parse_nutrition(ocr_text)
            ingredients = parse_ingredients(ocr_text)

            if run_ai:
                health_cond_str = user_profile.get("conditions", ["normal"])[0] if user_profile else "normal"
                risk = calculate_risk_score(nutrition_data, health_cond_str)
                flagged = check_ingredients(ocr_text)

                ai_result = get_gemini_analysis(
                    nutrition_data,
                    user_profile,
                    risk["score"],
                    risk["risk_level"],
                    flagged,
                )
                
                from ai.recomendation import generate_local_recommendation
                recommendation = generate_local_recommendation(
                    risk["risk_level"], 
                    health_cond_str, 
                    user_profile.get("goal", "general health") if user_profile else "general health"
                )

                ai_section = {
                    "nutrition_summary": nutrition_data,
                    "risk_score": risk["score"],
                    "risk_level": risk["risk_level"],
                    "flagged_ingredients": flagged,
                    "analysis": ai_result.get("analysis", "") if isinstance(ai_result, dict) else "",
                    "recommendation": recommendation,
                    "alternatives": get_alternative_foods(product_name or "unknown", health_cond_str),
                }
                if isinstance(ai_result, dict) and ai_result.get("error"):
                    ai_section["error"] = ai_result.get("error")

        # Save to cache
        cache_payload = {
            "ocr_status": ocr_status,
            "ocr_text": ocr_text,
            "nutrition_data": nutrition_data,
            "ingredients": ingredients,
        }
        if ai_section is not None:
            cache_payload["analysis"] = ai_section
        
        set_cached_analysis(cache_key, cache_payload)

        response = {
            "success": True,
            "ocr_status": ocr_status,
            "ocr_text": ocr_text,
            "nutrition_data": nutrition_data,
            "ingredients": ingredients,
        }

        if ai_section is not None:
            response["analysis"] = ai_section

        return jsonify(response), 200

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
    return jsonify({"status": "healthy", "service": "Nutria AI Backend"}), 200
