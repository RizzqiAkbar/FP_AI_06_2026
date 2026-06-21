'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import UploadCard, { UploadPayload } from '@/components/UploadCard';
import Loading from '@/components/Loading';
import ResultCard from '@/components/ResultCard';
import { AnalysisResult } from '@/types/analysis';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasProfile(!!localStorage.getItem('userProfile'));
  }, []);

  const handleAnalyze = async (payload: UploadPayload) => {
    setLoading(true);
    setResult(null);
    setError(null);

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const formData = new FormData();

    if (payload.mode === 'single' && payload.single) {
      formData.append('image', payload.single);
    } else if (payload.mode === 'multi' && payload.multi) {
      if (payload.multi.front_image) formData.append('front_image', payload.multi.front_image);
      if (payload.multi.nutrition_image) formData.append('nutrition_image', payload.multi.nutrition_image);
      if (payload.multi.ingredient_image) formData.append('ingredient_image', payload.multi.ingredient_image);
    }

    formData.append('user_profile', JSON.stringify(userProfile));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      const data: AnalysisResult = await res.json();
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      setError(`Gagal terhubung ke server. Pastikan backend berjalan di ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f7faf4', minHeight: '100vh' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#27500A' }}>
            Scan kemasan makanan
          </h1>
          <p className="text-sm" style={{ color: '#5F5E5A' }}>
            Upload foto kemasan untuk analisis nutrisi berbasis AI
          </p>
        </div>

        {/* Banner jika profil belum diisi */}
        {!hasProfile && (
          <div
            className="mb-4 p-4 rounded-[14px] text-sm"
            style={{ backgroundColor: '#fef9c3', border: '0.5px solid #fde047', color: '#854d0e' }}
          >
            Profil belum dilengkapi.{' '}
            <Link href="/profile" className="underline font-medium">Lengkapi sekarang</Link>
            {' '}untuk analisis yang lebih akurat.
          </div>
        )}

        <UploadCard onAnalyze={handleAnalyze} loading={loading} />

        {/* Tips */}
        <div
          className="mt-4 flex gap-3 rounded-[14px] p-4"
          style={{ backgroundColor: '#EAF3DE', border: '1px solid #C0DD97' }}
        >
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#639922' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#27500A' }}>
            <span className="font-semibold">Tips:</span> Pastikan foto cukup terang dan tulisan pada kemasan terlihat jelas agar dapat terbaca dengan akurat.
          </p>
        </div>

        {loading && (
          <div className="mt-8">
            <Loading />
          </div>
        )}

        {error && (
          <div
            className="mt-6 p-4 rounded-[14px] text-sm"
            style={{ backgroundColor: '#fee2e2', border: '0.5px solid #fca5a5', color: '#991b1b' }}
          >
            {error}
          </div>
        )}

        {result && (
          <div ref={resultRef} className="mt-8">
            <ResultCard result={result} onScanAnother={() => setResult(null)} />
          </div>
        )}

      </div>
    </div>
  );
}
