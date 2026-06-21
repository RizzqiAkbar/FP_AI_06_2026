# Nutria – Analisis Nutrisi Berbasis AI

## Anggota Kelompok 
|Nama|NRP|
|---|---|
|Rizqi Akbar|5027241044|
|Andi Naufal Zaki|5027241059|
|Hanif Mawla Faizi|5027241064|

## Deskripsi
Nutria adalah aplikasi web yang membantu pengguna mendapatkan rekomendasi diet personalisasi berdasarkan gambar label nutrisi makanan. Gambar di‑upload, diproses dengan OCR (menggunakan Gemini Vision dan fallback Tesseract), kemudian data nutrisi dibandingkan dengan profil kesehatan pengguna (mis‑mis: diabetes, hipertensi) untuk menghasilkan saran diet yang sesuai.

## Fitur Utama
- **Upload gambar label makanan** (jpg/png) dan ekstraksi data nutrisi otomatis.
- **Integrasi Gemini Vision** untuk OCR yang akurat pada gambar buram.
- **Caching SQLite**: hasil analisis disimpan berdasarkan hash gambar, mengurangi pemanggilan API Gemini secara signifikan.
- **Fallback lokal** menggunakan Tesseract bila API Gemini tidak tersedia atau kuota habis.
- **Pengaturan kesehatan pengguna** (umur, berat, tinggi, tujuan, kondisi medis) untuk rekomendasi yang dipersonalisasi.

## Arsitektur
```
root/
├─ backend/                # Flask API
│   ├─ app.py
│   ├─ routes/analyze.py   # Endpoint /api/analyze
│   ├─ ai/gemini_service.py
│   ├─ utils/cache.py      # MD5 hash + SQLite cache
│   └─ services/           # OCR & parser
├─ frontend/               # UI (HTML/JS/CSS)
├─ .env.example            # Contoh variabel lingkungan
└─ README.md               # Dokumentasi ini
```

## Setup Pengembangan
1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd FP_AI_06_2026
   ```
2. **Buat file `.env`** berdasarkan `.env.example` dan isi `GEMINI_API_KEY` Anda.
3. **Docker (disarankan)**
   ```bash
   docker-compose up --build
   ```
   Backend tersedia di `http://localhost:5000`.
4. **Tanpa Docker (Windows)**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```
   Pastikan Tesseract terinstal dan pathnya diatur pada variabel `TESSERACT_CMD`.

## Penggunaan API
- **POST /api/upload** – hanya OCR, mengembalikan data nutrisi.
- **POST /api/analyze** – OCR + analisis lengkap dengan profil pengguna.

## Caching & Penghematan Kuota
Setiap gambar di‑hash (MD5) dan hasil analisis disimpan di `nutria_cache.db`. Jika hash sudah ada, aplikasi langsung mengembalikan data dari cache, menghindari panggilan ke Gemini dan menghemat kuota secara drastis.

## Kontribusi
1. Fork repository.
2. Buat branch fitur (`git checkout -b fitur-baru`).
3. Submit Pull Request.
