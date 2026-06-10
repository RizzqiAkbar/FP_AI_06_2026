'use client';

import { useState, useRef, useCallback } from 'react';

interface UploadCardProps {
  onAnalyze: (files: File[]) => void;
  loading: boolean;
}

export default function UploadCard({ onAnalyze, loading }: UploadCardProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setFiles(prev => {
      const next = [...prev, ...valid];
      setPreviews(prev => [
        ...prev,
        ...valid.map(f => URL.createObjectURL(f)),
      ]);
      return next;
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const hasFiles = files.length > 0;

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>

      {/* Drop zone */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); if (!loading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl transition-all"
        style={{
          border: `2px dashed ${dragging ? '#27500A' : '#97C459'}`,
          backgroundColor: dragging ? '#EAF3DE' : '#f7faf4',
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: hasFiles ? '16px' : '48px 24px',
        }}
      >
        {hasFiles ? (
          <div>
            {/* Preview grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={src}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {!loading && (
                    <button
                      onClick={e => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {/* Add more tile */}
              {!loading && (
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
                  style={{ border: '1.5px dashed #C0DD97', backgroundColor: '#f7faf4' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="#639922" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs" style={{ color: '#5F5E5A' }}>Tambah</span>
                </div>
              )}
            </div>
            <p className="text-xs text-center" style={{ color: '#5F5E5A' }}>
              {files.length} foto dipilih · Klik untuk tambah lebih
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#EAF3DE' }}
            >
              <svg className="w-7 h-7" fill="none" stroke="#639922" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#27500A' }}>
              Klik atau seret foto ke sini
            </p>
            <p className="text-xs" style={{ color: '#5F5E5A' }}>
              Bisa upload beberapa foto sekaligus · JPEG, PNG, WEBP
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => addFiles(e.target.files)}
        disabled={loading}
      />

      {/* Analyze button */}
      <button
        onClick={() => hasFiles && !loading && onAnalyze(files)}
        disabled={!hasFiles || loading}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{
          backgroundColor: hasFiles && !loading ? '#27500A' : '#d4d4d4',
          cursor: hasFiles && !loading ? 'pointer' : 'not-allowed',
          color: hasFiles && !loading ? 'white' : '#9ca3af',
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
          'Analisis sekarang'
        )}
      </button>
    </div>
  );
}
