# Checklist Tugas Anggota 2 — Backend & OCR Engineer

## Status Legend
- ✅ = Selesai
- ⏸️ = On Hold (butuh action dari kamu)
- ❌ = Belum dikerjakan

---

## Minggu 1 — Setup & Development

### Hari 1 — Setup Backend
| No | Task | Status |
|----|------|--------|
| 1 | Struktur folder backend (`app.py`, `routes/`, `services/`, `uploads/`, `utils/`) | ✅ |
| 2 | File `requirements.txt` dengan semua dependensi | ✅ |
| 3 | File `config.py` (konfigurasi app, upload, Tesseract path) | ✅ |
| 4 | File `.env` untuk environment variables | ✅ |
| 5 | File `.gitignore` untuk backend | ✅ |
| 6 | Install dependencies (`pip install -r requirements.txt`) | ✅ |

### Hari 2 — API Dasar
| No | Task | Status |
|----|------|--------|
| 7 | Flask app dengan factory pattern (`create_app()`) | ✅ |
| 8 | CORS enabled untuk integrasi frontend | ✅ |
| 9 | Health check endpoint `GET /` | ✅ |
| 10 | Health check endpoint `GET /api/health` | ✅ |

### Hari 3 — Upload Gambar
| No | Task | Status |
|----|------|--------|
| 11 | Endpoint `POST /api/upload` | ✅ |
| 12 | Validasi format file (hanya png, jpg, jpeg, webp, bmp, tiff) | ✅ |
| 13 | Validasi ukuran file (max 10MB) | ✅ |
| 14 | Penyimpanan file dengan nama unik (UUID) | ✅ |
| 15 | Auto cleanup file setelah diproses | ✅ |

### Hari 4 — OCR
| No | Task | Status |
|----|------|--------|
| 16 | Service OCR (`services/ocr_service.py`) | ✅ |
| 17 | Multi-strategy OCR (advanced + simple + direct) | ✅ |
| 18 | Pilih hasil OCR terbaik secara otomatis | ✅ |
| 19 | Support multi-language (eng, ind) | ✅ |
| 20 | **Test OCR dengan gambar asli** | ⏸️ |

### Hari 5 — Image Preprocessing
| No | Task | Status |
|----|------|--------|
| 21 | Grayscale conversion | ✅ |
| 22 | Auto-resize gambar kecil (< 800px) | ✅ |
| 23 | Bilateral filter (noise reduction) | ✅ |
| 24 | Adaptive threshold (teks lebih tajam) | ✅ |
| 25 | Simple threshold (fallback) | ✅ |

### Hari 6 — Nutrition Parser
| No | Task | Status |
|----|------|--------|
| 26 | Parser calories, fat, protein, sugar, sodium | ✅ |
| 27 | Parser saturated fat, trans fat, cholesterol | ✅ |
| 28 | Parser carbohydrate, fiber, serving size | ✅ |
| 29 | Support format Bahasa Indonesia (Kalori, Lemak, Gula, dll.) | ✅ |
| 30 | Parser ingredients list | ✅ |
| 31 | Support multi-format (comma, semicolon, bullet separator) | ✅ |

### Hari 7 — Endpoint Analyze
| No | Task | Status |
|----|------|--------|
| 32 | Endpoint `POST /api/analyze` | ✅ |
| 33 | Menerima gambar + data profil user | ✅ |
| 34 | Return JSON (ocr_text, nutrition_data, ingredients, user_profile) | ✅ |
| 35 | Error handling lengkap | ✅ |

---

## Minggu 2 — Integrasi & Validasi

### Integrasi dengan Frontend
| No | Task | Status |
|----|------|--------|
| 36 | Endpoint menerima `request.form` (profil) + `request.files` (gambar) | ✅ |
| 37 | Response format siap dikonsumsi frontend | ✅ |
| 38 | **Test end-to-end dengan frontend (Anggota 1)** | ⏸️ |

### Validasi Input
| No | Task | Status |
|----|------|--------|
| 39 | Tolak file bukan gambar | ✅ |
| 40 | Tolak file > 10MB | ✅ |
| 41 | Return error jika OCR gagal baca | ✅ |
| 42 | Validasi profil user (age, weight, height, goal) | ✅ |

---

## Minggu 3 — Multi-Gambar (Novelty)

| No | Task | Status |
|----|------|--------|
| 43 | Support upload `nutrition_image` | ✅ |
| 44 | Support upload `ingredient_image` | ✅ |
| 45 | Support upload `front_image` | ✅ |
| 46 | OCR per-gambar lalu gabungkan | ✅ |
| 47 | Combine results menjadi satu data terstruktur | ✅ |
| 48 | Ekstraksi nama produk dari front label | ✅ |

---

## Tugas Tambahan (Optional)

| No | Task | Status |
|----|------|--------|
| 49 | Simpan riwayat scan | ❌ |
| 50 | OCR Bahasa Indonesia (lang pack `ind`) | ✅ (code ready, perlu install lang pack) |

---

## Summary

| Kategori | Selesai | On Hold | Belum |
|----------|---------|---------|-------|
| Code Implementation | 46 | 2 | 1 |
| **Total** | **46/49** | **2** | **1** |

---

## 🐳 Docker (DONE)

Docker image berhasil di-build dan diverifikasi. Untuk menjalankan:

```bash
# Dari root project
docker-compose up --build

# Atau manual
cd backend
docker build -t nutriguard-backend .
docker run -p 5000:5000 nutriguard-backend
```

Backend akan berjalan di `http://localhost:5000` dengan Tesseract OCR + bahasa Indonesia sudah terinstall di dalam container.

---

## ⏸️ Yang On Hold — Butuh Action dari Kamu

### 1. ~~Install Tesseract OCR~~ → SOLVED via Docker

Tesseract OCR engine belum terinstall di mesin kamu. Tanpa ini, OCR tidak bisa berjalan.

**Cara install (Windows):**
1. Download installer dari: https://github.com/UB-Mannheim/tesseract/wiki
2. Pilih versi terbaru (misal `tesseract-ocr-w64-setup-5.x.x.exe`)
3. Saat instalasi, **centang** "Additional language data" → pilih **Indonesian**
4. Default install path: `C:\Program Files\Tesseract-OCR\`
5. Setelah install, pastikan path di file `.env` sesuai:
   ```
   TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
   ```

**Verifikasi:**
```bash
tesseract --version
```

### 2. Test End-to-End dengan Frontend (Anggota 1)

Setelah Tesseract terinstall dan frontend sudah jadi, test flow lengkap:
- Frontend upload gambar → Backend proses → Return JSON → Frontend tampilkan

### 3. (Optional) Gemini API Key

Jika ingin test integrasi dengan AI (Anggota 3), kamu perlu:
- Mendapatkan API key dari https://aistudio.google.com/apikey
- Masukkan ke file `.env`:
  ```
  GEMINI_API_KEY=your_api_key_here
  ```

---

## Cara Menjalankan Backend

```bash
# 1. Masuk ke folder backend
cd backend

# 2. (Opsional) Aktifkan virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan server
python app.py

# 5. Test di browser
# http://localhost:5000 → {"status": "running", "app": "NutriGuard AI Backend"}
```

## Cara Test dengan Postman

### Test Upload (OCR saja)
```
POST http://localhost:5000/api/upload
Body: form-data
  - key: image (type: File) → pilih gambar nutrition facts
```

### Test Analyze (OCR + Profil User)
```
POST http://localhost:5000/api/analyze
Body: form-data
  - key: image (type: File) → pilih gambar
  - key: age (type: Text) → 21
  - key: weight (type: Text) → 85
  - key: height (type: Text) → 175
  - key: goal (type: Text) → cutting
  - key: health_conditions (type: Text) → diabetes,hipertensi
```

### Test Multi-Image
```
POST http://localhost:5000/api/analyze
Body: form-data
  - key: nutrition_image (type: File) → gambar nutrition facts
  - key: ingredient_image (type: File) → gambar ingredients
  - key: front_image (type: File) → gambar depan kemasan
  - key: age (type: Text) → 21
  - ... (profil lainnya)
```

---

## Struktur File yang Dibuat

```
backend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── app.py                        # Flask app entry point
├── config.py                     # App configuration
├── requirements.txt              # Python dependencies
├── test_app.py                   # Basic route tests
├── test_ocr.py                   # OCR integration test
├── ai/                           # (Anggota 3)
│   └── __init__.py
├── routes/
│   ├── __init__.py
│   └── analyze.py                # API endpoints
├── services/
│   ├── __init__.py
│   ├── img_preprocess.py         # Image preprocessing (OpenCV)
│   ├── ocr_service.py            # OCR extraction (Tesseract)
│   └── parser_service.py         # Nutrition & ingredient parsing
├── uploads/
│   └── .gitkeep                  # Folder untuk file upload sementara
└── utils/
    ├── __init__.py
    └── validators.py             # Input validation helpers
```
