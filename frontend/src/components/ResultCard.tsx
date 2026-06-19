'use client';

import { AnalysisResult, NutritionSummary } from '../types/analysis';

interface ResultCardProps {
  result: AnalysisResult;
  onScanAnother: () => void;
}

const NUTRISI_DISPLAY: { key: keyof NutritionSummary; label: string; unit: string }[] = [
  { key: 'calories',           label: 'Kalori',          unit: 'kkal' },
  { key: 'serving_size',       label: 'Ukuran Sajian',   unit: 'g' },
  { key: 'total_fat',          label: 'Total Lemak',     unit: 'g' },
  { key: 'fat',                label: 'Lemak',           unit: 'g' },
  { key: 'saturated_fat',      label: 'Lemak Jenuh',     unit: 'g' },
  { key: 'trans_fat',          label: 'Lemak Trans',     unit: 'g' },
  { key: 'cholesterol',        label: 'Kolesterol',      unit: 'mg' },
  { key: 'sodium',             label: 'Natrium',         unit: 'mg' },
  { key: 'total_carbohydrate', label: 'Karbohidrat',     unit: 'g' },
  { key: 'dietary_fiber',      label: 'Serat Pangan',    unit: 'g' },
  { key: 'sugar',              label: 'Gula',            unit: 'g' },
  { key: 'protein',            label: 'Protein',         unit: 'g' },
];

const getRiskLevelLabel = (level: string) => {
  if (level === 'Safe') return 'Aman';
  if (level === 'Moderate Risk') return 'Risiko Sedang';
  if (level === 'High Risk') return 'Risiko Tinggi';
  return 'Tidak Diketahui';
};

const getRecommendationLabel = (rec: string) => {
  if (rec?.toLowerCase().includes('consume')) return 'Aman dikonsumsi';
  if (rec?.toLowerCase().includes('limit')) return 'Batasi konsumsi';
  if (rec?.toLowerCase().includes('avoid')) return 'Hindari';
  return rec;
};

const getRiskScoreColors = (score: number | string) => {
  const n = Number(score);
  if (isNaN(n)) return { bg: '#f7faf4', text: '#5F5E5A', bar: '#d4e8c2', border: '#d4e8c2' };
  if (n <= 30) return { bg: '#EAF3DE', text: '#27500A', bar: '#639922', border: '#C0DD97' };
  if (n <= 60) return { bg: '#fef9c3', text: '#854d0e', bar: '#f59e0b', border: '#fde047' };
  return { bg: '#fee2e2', text: '#991b1b', bar: '#ef4444', border: '#fca5a5' };
};

const getRiskLevelColors = (level: string) => {
  if (level === 'Safe') return { bg: '#EAF3DE', text: '#27500A', border: '#C0DD97' };
  if (level === 'Moderate Risk') return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
  if (level === 'High Risk') return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
  return { bg: '#f7faf4', text: '#5F5E5A', border: '#d4e8c2' };
};

export default function ResultCard({ result, onScanAnother }: ResultCardProps) {
  const { analysis, ocr_status } = result;
  const ns = analysis?.nutrition_summary || {};
  const scoreColors = getRiskScoreColors(analysis.risk_score);
  const levelColors = getRiskLevelColors(analysis.risk_level);
  const scoreNum = Number(analysis.risk_score);
  const hasScore = !isNaN(scoreNum);

  const visibleNutrition = NUTRISI_DISPLAY.filter(({ key }) => ns[key] !== undefined);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#27500A' }}>Hasil Analisis</h2>
        <button
          onClick={onScanAnother}
          className="px-4 py-2 text-sm font-medium rounded-xl transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97' }}
        >
          ↻ Scan Lagi
        </button>
      </div>

      {/* Nama produk */}
      {result.product_name && (
        <div className="bg-white rounded-[14px] px-5 py-3" style={{ border: '0.5px solid #d4e8c2' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#639922' }}>Produk</p>
          <p className="text-sm font-semibold" style={{ color: '#27500A' }}>{result.product_name}</p>
        </div>
      )}

      {/* 1. OCR Status warning */}
      {ocr_status === 'failed' && (
        <div
          className="p-4 rounded-[14px] text-sm"
          style={{ backgroundColor: '#fef9c3', border: '0.5px solid #fde047', color: '#854d0e' }}
        >
          <strong>Peringatan:</strong> OCR gagal membaca kemasan. Hasil analisis mungkin tidak akurat. Coba upload foto yang lebih jelas dan terang.
        </div>
      )}

      {/* 2 & 3. Risk Score + Risk Level */}
      <div
        className="bg-white rounded-[14px] p-6 text-center"
        style={{ border: `0.5px solid ${scoreColors.border}`, backgroundColor: scoreColors.bg }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: scoreColors.text }}>
          Skor Risiko Kesehatan
        </p>
        <div className="text-7xl font-black mb-2" style={{ color: scoreColors.text }}>
          {hasScore ? scoreNum : '—'}
        </div>
        {hasScore && (
          <div
            className="h-2 rounded-full overflow-hidden mx-auto mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.1)', maxWidth: '200px' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(scoreNum, 100)}%`, backgroundColor: scoreColors.bar }}
            />
          </div>
        )}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: levelColors.bg,
            color: levelColors.text,
            border: `1px solid ${levelColors.border}`,
          }}
        >
          {getRiskLevelLabel(analysis.risk_level)}
        </span>
      </div>

      {/* 4. Nutrition Summary */}
      {visibleNutrition.length > 0 && (
        <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#639922' }}>
            Informasi Nutrisi
          </p>
          <div className="grid grid-cols-3 gap-3">
            {visibleNutrition.map(({ key, label, unit }) => (
              <div
                key={key}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: '#f7faf4', border: '0.5px solid #d4e8c2' }}
              >
                <div className="text-base font-bold" style={{ color: '#27500A' }}>
                  {ns[key]}
                  <span className="text-xs font-normal ml-0.5" style={{ color: '#5F5E5A' }}>{unit}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#5F5E5A' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Flagged Ingredients */}
      <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
          Bahan yang Perlu Diwaspadai
        </p>
        {!analysis.flagged_ingredients || analysis.flagged_ingredients.length === 0 ? (
          <p className="text-sm font-medium" style={{ color: '#27500A' }}>
            ✓ Tidak ada bahan berbahaya terdeteksi
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {analysis.flagged_ingredients.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '0.5px solid #fca5a5' }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. Recommendation */}
      {analysis.recommendation && (
        <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
            Rekomendasi
          </p>
          <p className="text-sm font-semibold" style={{ color: '#444441' }}>
            {getRecommendationLabel(analysis.recommendation)}
          </p>
        </div>
      )}

      {/* 7. Analysis (Gemini) */}
      {analysis.analysis && (
        <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
            Analisis Personal
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#444441' }}>
            {analysis.analysis}
          </p>
        </div>
      )}

      {/* 8. Alternatives */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#639922' }}>
            Alternatif Lebih Sehat
          </p>
          <ul className="space-y-2">
            {analysis.alternatives.map((alt, i) => (
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
  );
}
