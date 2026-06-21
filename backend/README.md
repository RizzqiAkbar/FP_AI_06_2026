# Nutria AI — Backend

Flask API + OCR service untuk analisis kemasan makanan.

---

## Quick Start (Docker) ⚡

Cara paling gampang untuk jalankan backend — semua sudah bundled (Tesseract + lang pack Indonesia).

```bash
# Dari root project
docker-compose up --build

# Backend jalan di http://localhost:5000
```

Atau build manual:

```bash
cd backend
docker build -t nutria-backend .
docker run -p 5000:5000 -e GEMINI_API_KEY=your_key nutria-backend
```

---

## Quick Start (Tanpa Docker)

Kalau mau jalankan langsung di Windows tanpa Docker:

### Prasyarat
- Python 3.10+
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) terinstall di `C:\Program Files\Tesseract-OCR\`

### Langkah

```bash
cd backend

# Buat virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Jalankan
python app.py
```

---

## API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/` | Health check |
| GET | `/api/health` | Service health |
| POST | `/api/upload` | Upload gambar → OCR → return nutrisi |
| POST | `/api/analyze` | Upload gambar + profil user → OCR → return data lengkap |

### POST `/api/upload` (Test OCR)

```
Content-Type: multipart/form-data

Fields:
  - image: file (gambar kemasan)
```

Response:
```json
{
  "success": true,
  "ocr_status": "success",
  "ocr_text": "Calories 320...",
  "nutrition_data": {"calories": 320, "sugar": 28, ...},
  "ingredients": ["Sugar", "Water", ...]
}
```

### POST `/api/analyze` (Full Analysis)

```
Content-Type: multipart/form-data

Fields:
  - image: file (single upload)
  --- ATAU ---
  - nutrition_image: file (nutrition facts)
  - ingredient_image: file (ingredients list)
  - front_image: file (depan kemasan)

  - age: 21
  - weight: 85
  - height: 175
  - goal: cutting
  - health_conditions: diabetes,hipertensi
```

Response:
```json
{
  "success": true,
  "ocr_status": "success",
  "ocr_text": "...",
  "nutrition_data": {...},
  "ingredients": [...],
  "product_name": "...",
  "user_profile": {...}
}
```

---

## Struktur Folder

```
backend/
├── app.py                    # Entry point Flask
├── config.py                 # Konfigurasi app
├── Dockerfile                # Docker image definition
├── .env                      # Environment variables (lokal)
├── .env.example              # Template env untuk tim
├── requirements.txt          # Python dependencies
├── routes/
│   └── analyze.py            # API endpoints
├── services/
│   ├── img_preprocess.py     # Image preprocessing (OpenCV)
│   ├── ocr_service.py        # OCR multi-strategy (Tesseract)
│   └── parser_service.py     # Nutrition & ingredient parser
├── ai/                       # (Anggota 3 - AI modules)
├── utils/
│   └── validators.py         # Input validation
└── uploads/                  # Temp folder (auto-cleanup)
```

---

## Environment Variables

| Variable | Default | Keterangan |
|----------|---------|------------|
| `FLASK_DEBUG` | `True` | Mode debug Flask |
| `SECRET_KEY` | `nutria-dev-key` | Flask secret key |
| `TESSERACT_CMD` | (lihat .env) | Path Tesseract (otomatis di Docker) |
| `GEMINI_API_KEY` | `` | API key Gemini (Anggota 3) |

---

## Fitur OCR

- Multi-strategy: 4 pass dengan config berbeda, pilih hasil terbaik
- Custom Tesseract config: `--oem 3 --psm 6` (optimal untuk nutrition facts)
- Image preprocessing: grayscale, resize, bilateral filter, adaptive threshold
- Fallback graceful: jika OCR gagal, tetap return response dengan status flag
- Support bahasa: English + Indonesian

---

## Catatan untuk Tim

- **Anggota 1 (Frontend):** Endpoint yang kamu hit adalah `POST /api/analyze`. Kirim form-data dengan gambar + profil user. Lihat contoh response di atas.
- **Anggota 3 (AI):** Module kamu di folder `ai/`. Data dari OCR dikirim sebagai dict ke fungsi kamu. Field `ocr_text`, `nutrition_data`, `ingredients`, dan `user_profile` semua tersedia.
- **CORS** sudah enabled — frontend di port berapa pun bisa hit backend.

---

## Status

✅ Mark 1 — Backend & OCR complete, siap integrasi lokal.
⏳ Menunggu Anggota 1 & 3 untuk test end-to-end.
