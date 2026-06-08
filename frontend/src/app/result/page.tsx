"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '../../types/analysis';
import ResultCard from '../../components/ResultCard';

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

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading Results...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-10">
      <ResultCard 
        result={result} 
        onScanAnother={() => router.push('/scan')} 
      />
    </div>
  );
}
