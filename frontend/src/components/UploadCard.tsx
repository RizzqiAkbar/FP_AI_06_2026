'use client';

import { useState, useRef, useCallback } from 'react';

export interface UploadPayload {
  images: File[];
}

interface UploadCardProps {
  onAnalyze: (payload: UploadPayload) => void;
  loading: boolean;
}

export default function UploadCard({ onAnalyze, loading }: UploadCardProps) {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 3;
  const MAX_SIZE_MB = 5;

  const handleFiles = (files: FileList | File[]) => {
    const validFiles: { file: File; preview: string }[] = [];
    const currentCount = images.length;
    let added = 0;

    for (let i = 0; i < files.length; i++) {
      if (currentCount + added >= MAX_IMAGES) break;
      const f = files[i];
      if (f.type.startsWith('image/')) {
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`File ${f.name} terlalu besar (Maksimal ${MAX_SIZE_MB}MB)`);
          continue;
        }
        validFiles.push({ file: f, preview: URL.createObjectURL(f) });
        added++;
      }
    }
    setImages((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (loading) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    if (loading) return;
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const canSubmit = images.length > 0 && !loading;

  const handleAnalyze = () => {
    if (canSubmit) {
      onAnalyze({ images: images.map((i) => i.file) });
    }
  };

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#27500A' }}>
          Upload Product Photos
        </h3>
        <p className="text-xs" style={{ color: '#5F5E5A' }}>
          Maksimal {MAX_IMAGES} foto ({MAX_SIZE_MB}MB per foto).<br/>
          Paling baik jika menyertakan kemasan depan, informasi nilai gizi, dan komposisi.
        </p>
      </div>

      <div
        onClick={() => !loading && images.length < MAX_IMAGES && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!loading && images.length < MAX_IMAGES) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl transition-all"
        style={{
          border: `2px dashed ${dragging ? '#27500A' : '#97C459'}`,
          backgroundColor: dragging ? '#EAF3DE' : '#f7faf4',
          cursor: loading || images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
          padding: '24px',
          minHeight: '160px',
        }}
      >
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EAF3DE' }}>
            <svg className="w-6 h-6" fill="none" stroke="#639922" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#27500A' }}>
            Klik atau seret foto ke sini
          </p>
          <p className="text-xs" style={{ color: '#5F5E5A' }}>
            JPEG, PNG, WEBP
          </p>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden" style={{ border: '1px solid #d4e8c2' }}>
                <img
                  src={img.preview}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {!loading && (
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={loading || images.length >= MAX_IMAGES}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={!canSubmit}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          backgroundColor: canSubmit ? '#27500A' : '#d4d4d4',
          color: canSubmit ? 'white' : '#9ca3af',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Mengekstrak Data...
          </span>
        ) : (
          'Lanjutkan'
        )}
      </button>
    </div>
  );
}
