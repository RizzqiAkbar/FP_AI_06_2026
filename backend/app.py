from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.analyze import analyze_bp
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

app.register_blueprint(analyze_bp, url_prefix='/api/analyze')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
