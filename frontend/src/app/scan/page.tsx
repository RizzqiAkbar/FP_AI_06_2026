'use client';

import { useState } from 'react';
import { analyzeFood } from '../../lib/api';
import UploadCard from '../../components/UploadCard';
import { AnalysisResult, NutritionSummary } from '../../types/analysis';

const DUMMY_RESULT: AnalysisResult = {
  success: true,
  ocr_status: 'success',
  product_name: 'Indomie Goreng Spesial',
  analysis: {
    nutrition_summary: { calories: 385, protein: 8, fat: 14, sugar: 3, carbohydrates: 55, sodium: 880 },
    risk_score: 62,
    risk_level: 'Sedang',
    flagged_ingredients: [
      'Natrium glutamat / MSG',
      'Natrium tinggi — 880 mg per sajian (37% kebutuhan harian)',
      'Lemak jenuh',
    ],
    analysis:
      'Produk ini mengandung kalori cukup tinggi dengan kadar sodium yang signifikan (880 mg/sajian). Kandungan MSG dan lemak jenuh perlu diwaspadai bagi penderita hipertensi dan gangguan kardiovaskular.',
    recommendation:
      'Batasi konsumsi maksimal 1 porsi per hari. Tambahkan sayuran segar dan protein seperti telur untuk meningkatkan nilai gizi. Minum air putih yang cukup setelah mengonsumsi produk ini.',
    alternatives: [
      'Mie Shirataki — rendah kalori, tanpa gluten',
      'Soba organik dengan kaldu sayuran',
      'Mie jagung tanpa MSG dan pengawet',
    ],
  },
};

const NUTRISI_LABEL: Record<string, string> = {
  calories:      'Kalori',
  protein:       'Protein',
  fat:           'Lemak',
  sugar:         'Gula',
  carbohydrates: 'Karbohidrat',
  sodium:        'Sodium',
};

const NUTRISI_UNIT: Record<string, string> = {
  calories: 'kkal',
  protein:  'g',
  fat:      'g',
  sugar:    'g',
  carbohydrates: 'g',
  sodium:   'mg',
};

function riskStyle(level: string) {
  const l = level?.toLowerCase();
  if (l === 'rendah' || l === 'low')
    return { bg: '#EAF3DE', text: '#27500A', border: '#C0DD97' };
  if (l === 'sedang' || l === 'medium' || l === 'moderate')
    return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
  return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
}

function NutritionGrid({ data }: { data: NutritionSummary }) {
  const keys = Object.keys(NUTRISI_LABEL).filter(k => data[k] !== undefined);
  if (!keys.length) return null;
  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map(k => (
        <div
          key={k}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: '#f7faf4', border: '0.5px solid #d4e8c2' }}
        >
          <div className="text-lg font-bold" style={{ color: '#27500A' }}>
            {data[k]}
            <span className="text-xs font-normal ml-0.5" style={{ color: '#5F5E5A' }}>
              {NUTRISI_UNIT[k]}
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5F5E5A' }}>
            {NUTRISI_LABEL[k]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (files: File[]) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const profileStr = localStorage.getItem('userProfile');
      const profile = profileStr ? JSON.parse(profileStr) : {};
      const data = await analyzeFood(files, profile);
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback ke data dummy saat backend belum tersedia
      await new Promise(r => setTimeout(r, 600));
      setResult(DUMMY_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const risk = result ? riskStyle(result.analysis?.risk_level ?? '') : null;

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#f7faf4' }}>
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#27500A' }}>
            Scan kemasan makanan
          </h1>
          <p className="text-sm" style={{ color: '#5F5E5A' }}>
            Upload foto kemasan untuk analisis nutrisi berbasis AI
          </p>
        </div>

        {/* Upload card */}
        <UploadCard onAnalyze={handleAnalyze} loading={loading} />

        {/* Tips box */}
        <div
          className="flex gap-3 rounded-[14px] p-4"
          style={{ backgroundColor: '#EAF3DE', border: '1px solid #C0DD97' }}
        >
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#639922' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: '#27500A' }}>
            <span className="font-semibold">Tips:</span> Pastikan foto cukup terang dan tulisan pada kemasan terlihat jelas agar OCR dapat membaca dengan akurat.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-[14px] p-4 text-sm"
            style={{ backgroundColor: '#fee2e2', border: '0.5px solid #fca5a5', color: '#991b1b' }}
          >
            {error}
          </div>
        )}

        {/* ── Hasil analisis ── */}
        {result && (
          <div className="space-y-4">

            {/* Produk + Risk level */}
            <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#639922' }}>
                    Produk teridentifikasi
                  </p>
                  <h2 className="text-lg font-bold" style={{ color: '#27500A' }}>
                    {result.product_name || 'Produk tidak dikenali'}
                  </h2>
                </div>
                {result.analysis?.risk_level && risk && (
                  <div
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: risk.bg, color: risk.text, border: `1px solid ${risk.border}` }}
                  >
                    {result.analysis.risk_level}
                  </div>
                )}
              </div>

              {/* Risk score bar */}
              {result.analysis?.risk_score !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs" style={{ color: '#5F5E5A' }}>Risk score</span>
                    <span className="text-xs font-semibold" style={{ color: '#27500A' }}>
                      {result.analysis.risk_score}/100
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#EAF3DE' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(Number(result.analysis.risk_score), 100)}%`,
                        backgroundColor:
                          Number(result.analysis.risk_score) <= 30 ? '#639922' :
                          Number(result.analysis.risk_score) <= 60 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Ringkasan Nutrisi */}
            {result.analysis?.nutrition_summary && Object.keys(result.analysis.nutrition_summary).length > 0 && (
              <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#639922' }}>
                  Ringkasan nutrisi
                </p>
                <NutritionGrid data={result.analysis.nutrition_summary} />
              </div>
            )}

            {/* Bahan yang perlu diperhatikan */}
            {result.analysis?.flagged_ingredients?.length > 0 && (
              <div
                className="rounded-[14px] p-5"
                style={{ backgroundColor: '#fef9c3', border: '0.5px solid #fde047' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#854d0e' }}>
                  Bahan yang perlu diperhatikan
                </p>
                <ul className="space-y-1.5">
                  {result.analysis.flagged_ingredients.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#78350f' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f59e0b' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analisis AI */}
            {result.analysis?.analysis && (
              <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
                  Analisis AI
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#444441' }}>
                  {result.analysis.analysis}
                </p>
              </div>
            )}

            {/* Rekomendasi */}
            {result.analysis?.recommendation && (
              <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
                  Rekomendasi
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#444441' }}>
                  {result.analysis.recommendation}
                </p>
              </div>
            )}

            {/* Alternatif produk */}
            {result.analysis?.alternatives?.length > 0 && (
              <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
                  Alternatif produk
                </p>
                <ul className="space-y-2">
                  {result.analysis.alternatives.map((alt, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#444441' }}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: '#EAF3DE', color: '#27500A' }}
                      >
                        {i + 1}
                      </div>
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
