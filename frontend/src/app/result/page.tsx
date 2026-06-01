"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '../../types/analysis';

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('analysisResult');
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      router.push('/scan');
    }
  }, [router]);

  if (!result) return <div className="text-center mt-20 text-xl font-medium animate-pulse">Loading Results...</div>;

  const { analysis } = result;
  
  const getRiskColor = (score: number) => {
    if (score < 50) return 'text-red-600';
    if (score < 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBg = (score: number) => {
    if (score < 50) return 'bg-red-50 border-red-200';
    if (score < 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Result</h2>
        <button onClick={() => router.push('/scan')} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
          Scan Another
        </button>
      </div>
      
      {/* Score Card */}
      <div className={`p-8 rounded-2xl shadow-sm border text-center ${getRiskBg(analysis.risk_score)}`}>
        <h3 className="text-lg font-medium text-gray-700 uppercase tracking-wider">Health Risk Score</h3>
        <p className={`text-7xl font-extrabold mt-3 ${getRiskColor(analysis.risk_score)}`}>
          {analysis.risk_score}<span className="text-3xl text-gray-500 font-bold">/100</span>
        </p>
        <p className="mt-3 text-xl text-gray-800 font-bold">
          {analysis.risk_score < 50 ? 'High Risk' : analysis.risk_score < 80 ? 'Moderate Risk' : 'Safe to Consume'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommendation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span> Recommendation
          </h3>
          <div className="bg-blue-50 text-blue-900 p-5 rounded-xl border border-blue-100 flex-grow font-medium text-lg leading-relaxed shadow-inner">
            {analysis.recommendation}
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span> Nutrition Facts
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Calories</span><span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{analysis.nutrition_summary?.calories || 'N/A'}</span></li>
            <li className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Protein</span><span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{analysis.nutrition_summary?.protein || 'N/A'}</span></li>
            <li className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Sugar</span><span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{analysis.nutrition_summary?.sugar || 'N/A'}</span></li>
            <li className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600 font-medium">Fat</span><span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{analysis.nutrition_summary?.fat || 'N/A'}</span></li>
          </ul>
        </div>
      </div>

      {/* Deep Analysis */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🔬</span> Personalized Analysis
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {analysis.analysis}
        </p>
      </div>

      {/* Alternatives */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">✅</span> Better Alternatives
          </h3>
          <div className="flex flex-wrap gap-4">
            {analysis.alternatives.map((alt, idx) => (
              <span key={idx} className="bg-green-100 border border-green-200 text-green-800 px-5 py-3 rounded-xl font-bold shadow-sm flex items-center">
                <span className="text-green-500 mr-2">✓</span> {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
