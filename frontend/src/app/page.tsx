'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      router.replace('/scan');
    }
  }, [router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7faf4' }}>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
            style={{ backgroundColor: '#EAF3DE', color: '#27500A' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Analisis nutrisi berbasis AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-[52px] font-bold leading-tight mb-5" style={{ color: '#27500A' }}>
            Kenali makananmu,{' '}
            <br className="hidden sm:block" />
            <span style={{ color: '#639922' }}>jaga kesehatanmu</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] leading-relaxed max-w-xl mx-auto mb-14" style={{ color: '#5F5E5A' }}>
            Scan kemasan produk makanan dan dapatkan analisis nutrisi yang dipersonalisasi sesuai kondisi dan tujuan kesehatanmu.
          </p>

          {/* ── 2 Boxes ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">

            {/* Box kiri — Masuk / Daftar */}
            <div
              className="rounded-2xl p-6 text-left"
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #d4d4d4' }}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#27500A' }}>
                  <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#27500A' }}>Masuk / Daftar</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#5F5E5A' }}>
                Simpan riwayat analisis dan dapatkan rekomendasi yang lebih personal sesuai profilmu.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  className="w-full py-2.5 text-sm font-semibold text-white rounded-lg text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#27500A' }}
                >
                  Masuk
                </Link>
                <Link
                  href="/profile"
                  className="w-full py-2.5 text-sm font-medium rounded-lg text-center transition-colors hover:bg-[#d0d0d0]"
                  style={{ backgroundColor: '#e0e0e0', color: '#444441' }}
                >
                  Daftar sekarang
                </Link>
              </div>
            </div>

            {/* Box kanan — Scan langsung */}
            <div
              className="rounded-2xl p-6 text-left"
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #d4d4d4' }}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#27500A' }}>
                  <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM21 3.8h-3.2l-1.5-2H7.7L6.2 3.8H3C1.9 3.8 1 4.7 1 5.8v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm-9 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#27500A' }}>Scan langsung</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#5F5E5A' }}>
                Langsung scan kemasan produk makanan tanpa perlu membuat akun terlebih dahulu.
              </p>
              <Link
                href="/scan"
                className="w-full block py-2.5 text-sm font-semibold text-white rounded-lg text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#3B6D11' }}
              >
                Scan sekarang
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="fitur" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Label */}
          <div className="text-center mb-12">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#639922' }}
            >
              Fitur Unggulan
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Card 1 — Scan kemasan */}
            <div
              className="bg-white rounded-[14px] p-6"
              style={{ border: '0.5px solid #d4e8c2' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#EAF3DE' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Scan Kemasan</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                Foto kemasan produk makanan dan sistem kami akan membaca informasi nutrisi secara otomatis menggunakan teknologi OCR.
              </p>
            </div>

            {/* Card 2 — Analisis AI */}
            <div
              className="bg-white rounded-[14px] p-6"
              style={{ border: '0.5px solid #d4e8c2' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#EAF3DE' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Analisis AI</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                Kecerdasan buatan menganalisis kandungan nutrisi dan menilai risiko kesehatan berdasarkan profil dan kondisi kesehatanmu.
              </p>
            </div>

            {/* Card 3 — Rekomendasi personal */}
            <div
              className="bg-white rounded-[14px] p-6"
              style={{ border: '0.5px solid #d4e8c2' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#EAF3DE' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Rekomendasi Personal</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                Dapatkan saran konsumsi, peringatan bahan berbahaya, dan rekomendasi produk alternatif yang lebih sehat untukmu.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
