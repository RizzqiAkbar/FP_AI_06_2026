'use client';

import { useState, useRef, useCallback } from 'react';

export interface UploadPayload {
  mode: 'single' | 'multi';
  single?: File;
  multi?: {
    front_image?: File;
    nutrition_image?: File;
    ingredient_image?: File;
  };
}

interface UploadCardProps {
  onAnalyze: (payload: UploadPayload) => void;
  loading: boolean;
}

interface ImageSlotProps {
  label: string;
  file: File | undefined;
  preview: string | undefined;
  disabled: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function ImageSlot({ label, file, preview, disabled, onSelect, onRemove }: ImageSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) onSelect(f);
  };

  return (
    <div>
      <p className="text-xs font-medium mb-1.5" style={{ color: '#5F5E5A' }}>{label}</p>
      <div
        onClick={() => !disabled && !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); }}
        onDrop={handleDrop}
        className="relative rounded-xl overflow-hidden transition-all"
        style={{
          border: file ? '1.5px solid #639922' : '1.5px dashed #C0DD97',
          backgroundColor: file ? 'transparent' : '#f7faf4',
          aspectRatio: '1',
          cursor: disabled ? 'not-allowed' : file ? 'default' : 'pointer',
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="w-full h-full object-cover" />
            {!disabled && (
              <button
                onClick={e => { e.stopPropagation(); onRemove(); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
            <svg className="w-6 h-6" fill="none" stroke="#C0DD97" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs text-center leading-tight" style={{ color: '#5F5E5A' }}>Opsional</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export default function UploadCard({ onAnalyze, loading }: UploadCardProps) {
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  // Single mode
  const [singleFile, setSingleFile] = useState<File | undefined>();
  const [singlePreview, setSinglePreview] = useState<string | undefined>();
  const singleInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // Multi mode
  const [multiFiles, setMultiFiles] = useState<{
    front_image?: File;
    nutrition_image?: File;
    ingredient_image?: File;
  }>({});
  const [multiPreviews, setMultiPreviews] = useState<{
    front_image?: string;
    nutrition_image?: string;
    ingredient_image?: string;
  }>({});

  const setSingleImage = useCallback((file: File) => {
    if (singlePreview) URL.revokeObjectURL(singlePreview);
    setSingleFile(file);
    setSinglePreview(URL.createObjectURL(file));
  }, [singlePreview]);

  const removeSingle = () => {
    if (singlePreview) URL.revokeObjectURL(singlePreview);
    setSingleFile(undefined);
    setSinglePreview(undefined);
  };

  const setMultiImage = (key: keyof typeof multiFiles, file: File) => {
    const prev = multiPreviews[key];
    if (prev) URL.revokeObjectURL(prev);
    setMultiFiles(f => ({ ...f, [key]: file }));
    setMultiPreviews(p => ({ ...p, [key]: URL.createObjectURL(file) }));
  };

  const removeMultiImage = (key: keyof typeof multiFiles) => {
    const prev = multiPreviews[key];
    if (prev) URL.revokeObjectURL(prev);
    setMultiFiles(f => { const n = { ...f }; delete n[key]; return n; });
    setMultiPreviews(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (loading) return;
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) setSingleImage(f);
  };

  const canSubmitSingle = !!singleFile && !loading;
  const canSubmitMulti = Object.keys(multiFiles).length > 0 && !loading;

  const handleAnalyze = () => {
    if (mode === 'single' && singleFile) {
      onAnalyze({ mode: 'single', single: singleFile });
    } else if (mode === 'multi' && canSubmitMulti) {
      onAnalyze({ mode: 'multi', multi: multiFiles });
    }
  };

  const canSubmit = mode === 'single' ? canSubmitSingle : canSubmitMulti;

  return (
    <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>

      {/* Mode toggle */}
      <div
        className="flex mb-5 rounded-xl overflow-hidden"
        style={{ border: '1px solid #d4e8c2', backgroundColor: '#f7faf4' }}
      >
        {(['single', 'multi'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: mode === m ? '#27500A' : 'transparent',
              color: mode === m ? 'white' : '#5F5E5A',
            }}
          >
            {m === 'single' ? '1 Foto' : '3 Foto'}
          </button>
        ))}
      </div>

      {/* Single mode */}
      {mode === 'single' && (
        <>
          <div
            onClick={() => !loading && !singleFile && singleInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); if (!loading) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className="rounded-xl transition-all"
            style={{
              border: `2px dashed ${dragging ? '#27500A' : '#97C459'}`,
              backgroundColor: dragging ? '#EAF3DE' : '#f7faf4',
              cursor: loading ? 'not-allowed' : singleFile ? 'default' : 'pointer',
              padding: singleFile ? '16px' : '48px 24px',
            }}
          >
            {singleFile && singlePreview ? (
              <div>
                <div className="relative group aspect-video max-h-48 mx-auto">
                  <img
                    src={singlePreview}
                    alt="Foto dipilih"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  {!loading && (
                    <button
                      onClick={e => { e.stopPropagation(); removeSingle(); }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-xs text-center mt-2" style={{ color: '#5F5E5A' }}>
                  {singleFile.name}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EAF3DE' }}>
                  <svg className="w-7 h-7" fill="none" stroke="#639922" strokeWidth={1.5} viewBox="0 0 24 24">
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
            )}
          </div>
          <input
            ref={singleInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) setSingleImage(f);
              e.target.value = '';
            }}
          />
        </>
      )}

      {/* Multi mode */}
      {mode === 'multi' && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#5F5E5A' }}>
            Minimal 1 foto harus diisi. Semakin lengkap, semakin akurat analisisnya.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <ImageSlot
              label="Foto depan produk"
              file={multiFiles.front_image}
              preview={multiPreviews.front_image}
              disabled={loading}
              onSelect={f => setMultiImage('front_image', f)}
              onRemove={() => removeMultiImage('front_image')}
            />
            <ImageSlot
              label="Nutrition facts"
              file={multiFiles.nutrition_image}
              preview={multiPreviews.nutrition_image}
              disabled={loading}
              onSelect={f => setMultiImage('nutrition_image', f)}
              onRemove={() => removeMultiImage('nutrition_image')}
            />
            <ImageSlot
              label="Daftar bahan"
              file={multiFiles.ingredient_image}
              preview={multiPreviews.ingredient_image}
              disabled={loading}
              onSelect={f => setMultiImage('ingredient_image', f)}
              onRemove={() => removeMultiImage('ingredient_image')}
            />
          </div>
        </div>
      )}

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
            Menganalisis...
          </span>
        ) : (
          'Analisis sekarang'
        )}
      </button>
    </div>
  );
}
