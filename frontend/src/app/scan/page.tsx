"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeFood } from '../../lib/api';

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const profileStr = localStorage.getItem('userProfile');
      const profile = profileStr ? JSON.parse(profileStr) : {};
      
      const result = await analyzeFood(file, profile);
      localStorage.setItem('analysisResult', JSON.stringify(result));
      router.push('/result');
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the food. Please try again or check backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Scan Food Packaging</h2>
        <p className="text-gray-600 mb-8">Upload Nutrition Facts, Ingredients List, or Product Label</p>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-4 border-dashed border-gray-300 rounded-2xl p-12 cursor-pointer hover:border-green-400 hover:bg-green-50 transition duration-200"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto max-h-64 object-contain rounded-lg shadow-md" />
          ) : (
            <div className="text-gray-500">
              <span className="text-6xl block mb-4">📸</span>
              <p className="text-lg font-medium">Click to upload an image</p>
              <p className="text-sm mt-2 opacity-70">JPEG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}
        </div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          className="hidden" 
        />

        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className={`mt-8 w-full py-4 rounded-xl text-white font-bold text-lg transition shadow-lg ${
            !file || loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing with AI...
            </span>
          ) : 'Analyze Food'}
        </button>
      </div>
    </div>
  );
}
