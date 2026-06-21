"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeFood } from '../../lib/api';
import UploadCard from '../../components/UploadCard';
import Loading from '../../components/Loading';

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    setLoading(true);
    
    try {
      const profileStr = localStorage.getItem('userProfile');
      const profile = profileStr ? JSON.parse(profileStr) : {};
      
      const result = await analyzeFood(file, profile);
      localStorage.setItem('analysisResult', JSON.stringify(result));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem('scannedImage', base64String);
        } catch (e) {
          console.warn('Could not save image to localStorage', e);
        }
        router.push('/result');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the food. Please try again or check backend server.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      {loading ? (
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40">
          <Loading />
        </div>
      ) : (
        <UploadCard onUpload={handleUpload} loading={loading} />
      )}
    </div>
  );
}
