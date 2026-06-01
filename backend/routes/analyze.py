from flask import Blueprint, request, jsonify
from services.ocr_service import extract_text_from_image
from ai.gemini_service import get_gemini_analysis
import os
from werkzeug.utils import secure_filename
import json

analyze_bp = Blueprint('analyze', __name__)

@analyze_bp.route('/', methods=['POST'])
def analyze_food():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    user_profile_str = request.form.get('user_profile', '{}')
    try:
        user_profile = json.loads(user_profile_str)
    except Exception as e:
        user_profile = {}

    filename = secure_filename(file.filename)
    filepath = os.path.join('uploads', filename)
    file.save(filepath)
    
    # 1. OCR Extraction
    ocr_text = extract_text_from_image(filepath)
    
    if not ocr_text.strip():
        # Fallback if OCR fails
        ocr_text = "Unknown content. Could not read label."
        
    # 2. AI Analysis
    analysis_result = get_gemini_analysis(ocr_text, user_profile)
    
    # Optional: Delete file after processing to save space
    if os.path.exists(filepath):
        os.remove(filepath)
    
    return jsonify({
        "ocr_text": ocr_text,
        "analysis": analysis_result
    })
