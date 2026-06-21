import { useState, useRef } from 'react';

interface UploadCardProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function UploadCard({ onUpload, loading }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 text-center relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2 relative z-10 tracking-tight">Scan Food Packaging</h2>
      <p className="text-gray-500 mb-8 relative z-10 text-lg">Upload an image for instant AI nutritional analysis.</p>
      
      <div className="grid grid-cols-3 gap-4 mb-8 text-sm font-medium text-gray-600">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">Nutrition Facts</div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">Ingredient List</div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">Front Packaging</div>
      </div>

      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`border-4 border-dashed rounded-3xl p-12 transition-all duration-300 relative z-10 ${
          loading ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : 'border-gray-300 cursor-pointer hover:border-green-400 hover:bg-green-50/50 hover:shadow-inner'
        }`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="mx-auto max-h-64 object-contain rounded-xl shadow-md ring-1 ring-black/5" />
            {!loading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg">Change Image</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 transform transition hover:scale-105">
            <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-4xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-800">Click to choose a file</p>
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
        disabled={loading}
      />

      <button 
        onClick={() => file && onUpload(file)} 
        disabled={!file || loading}
        className={`mt-8 w-full py-5 rounded-xl font-extrabold text-lg transition-all duration-300 relative z-10 ${
          !file || loading 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
            : 'text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-600/30 transform hover:-translate-y-1 hover:shadow-xl focus:ring-4 focus:ring-green-500/50'
        }`}
      >
        Analyze Food
      </button>
    </div>
  );
}
