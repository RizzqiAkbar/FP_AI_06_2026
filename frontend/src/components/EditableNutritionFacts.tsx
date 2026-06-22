'use client';

import { useState } from 'react';

export interface NutritionData {
  calories?: number;
  protein?: number;
  sugar?: number;
  fat?: number;
  sodium?: number;
  [key: string]: number | undefined;
}

interface EditableNutritionFactsProps {
  initialNutritionData: NutritionData;
  initialIngredients: string[];
  productName: string;
  onAnalyzeText: (data: { nutrition_data: NutritionData; ingredients: string[]; product_name: string }) => void;
  loading: boolean;
}

export default function EditableNutritionFacts({
  initialNutritionData,
  initialIngredients,
  productName,
  onAnalyzeText,
  loading,
}: EditableNutritionFactsProps) {
  const [nutritionData, setNutritionData] = useState<NutritionData>(initialNutritionData || {});
  const [ingredientsText, setIngredientsText] = useState((initialIngredients || []).join(', '));
  const [name, setName] = useState(productName || '');

  const handleChange = (key: string, value: string) => {
    setNutritionData((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : Number(value),
    }));
  };

  const handleAnalyze = () => {
    const ingredientsArray = ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    onAnalyzeText({
      nutrition_data: nutritionData,
      ingredients: ingredientsArray,
      product_name: name,
    });
  };

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#27500A' }}>
          Verifikasi Data
        </h3>
        <p className="text-xs" style={{ color: '#5F5E5A' }}>
          Pastikan data yang diekstrak sudah benar. Anda dapat mengeditnya sebelum melakukan analisis.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#5F5E5A' }}>Nama Produk</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg text-sm"
            style={{ border: '1px solid #d4e8c2', backgroundColor: '#f7faf4' }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#5F5E5A' }}>Nilai Gizi</label>
          <div className="grid grid-cols-2 gap-3">
            {['calories', 'protein', 'sugar', 'fat', 'sodium'].map((key) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] uppercase mb-1" style={{ color: '#9ca3af' }}>{key}</span>
                <input
                  type="number"
                  value={nutritionData[key] !== undefined ? nutritionData[key] : ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-2 rounded-lg text-sm"
                  style={{ border: '1px solid #d4e8c2', backgroundColor: '#f7faf4' }}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#5F5E5A' }}>Komposisi (pisahkan dengan koma)</label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            className="w-full p-2 rounded-lg text-sm h-24"
            style={{ border: '1px solid #d4e8c2', backgroundColor: '#f7faf4' }}
            placeholder="Gula, garam, air..."
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-6 w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          backgroundColor: loading ? '#d4d4d4' : '#27500A',
          color: loading ? '#9ca3af' : 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Menganalisis...
          </span>
        ) : (
          'Analisis Data'
        )}
      </button>
    </div>
  );
}
