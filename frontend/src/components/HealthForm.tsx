'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GOALS = [
  { value: 'cutting',  label: 'Cutting',  desc: 'Turunkan lemak tubuh' },
  { value: 'bulking',  label: 'Bulking',  desc: 'Tambah massa otot' },
  { value: 'maintain', label: 'Maintain', desc: 'Jaga berat badan' },
  { value: 'general',  label: 'General',  desc: 'Gaya hidup sehat' },
];

const CONDITIONS = [
  { value: 'diabetes',   label: 'Diabetes' },
  { value: 'hipertensi', label: 'Hipertensi' },
  { value: 'kolesterol', label: 'Kolesterol' },
  { value: 'asam_urat',  label: 'Asam Urat' },
  { value: 'obesitas',   label: 'Obesitas' },
  { value: 'none',       label: 'Tidak ada' },
];

const inputStyle = {
  border: '1px solid #d4e8c2',
  backgroundColor: '#f7faf4',
  color: '#27500A',
};

export default function HealthForm() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    age: '' as number | '',
    weight: '' as number | '',
    height: '' as number | '',
    goal: 'maintain',
    conditions: [] as string[],
  });

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const toggleCondition = (value: string) => {
    setProfile(p => {
      if (value === 'none') {
        return { ...p, conditions: p.conditions.includes('none') ? [] : ['none'] };
      }
      const without = p.conditions.filter(c => c !== 'none');
      return {
        ...p,
        conditions: without.includes(value)
          ? without.filter(c => c !== value)
          : [...without, value],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    router.push('/scan');
  };

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#f7faf4' }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#173404' }}>
            Lengkapi data dirimu
          </h1>
          <p className="text-sm" style={{ color: '#5F5E5A' }}>
            Data ini digunakan untuk rekomendasi yang lebih personal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Data diri ── */}
          <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#639922' }}>
              Data diri
            </p>

            {/* Nama */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#444441' }}>
                Nama{' '}
                <span className="font-normal text-xs" style={{ color: '#5F5E5A' }}>(opsional)</span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Nama kamu"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>

            {/* Umur / Berat / Tinggi */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'age',    label: 'Umur',         placeholder: '25',  unit: 'thn' },
                { key: 'weight', label: 'Berat badan',   placeholder: '65',  unit: 'kg' },
                { key: 'height', label: 'Tinggi badan',  placeholder: '170', unit: 'cm' },
              ].map(({ key, label, placeholder, unit }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#444441' }}>
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={profile[key as 'age' | 'weight' | 'height'] as string}
                      onChange={e =>
                        setProfile(p => ({ ...p, [key]: e.target.value === '' ? '' : Number(e.target.value) }))
                      }
                      placeholder={placeholder}
                      required
                      min="1"
                      className="w-full pl-4 pr-10 py-3 rounded-xl text-sm outline-none"
                      style={inputStyle}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: '#5F5E5A' }}
                    >
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Goal ── */}
          <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#639922' }}>
              Goal kesehatan
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(g => {
                const active = profile.goal === g.value;
                return (
                  <button
                    type="button"
                    key={g.value}
                    onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: active ? '#EAF3DE' : '#f7faf4',
                      border: active ? '1.5px solid #639922' : '1px solid #d4e8c2',
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: active ? '#27500A' : '#444441' }}>
                      {g.label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: active ? '#639922' : '#5F5E5A' }}>
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Kondisi kesehatan ── */}
          <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#639922' }}>
              Kondisi kesehatan
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CONDITIONS.map(c => {
                const active = profile.conditions.includes(c.value);
                return (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => toggleCondition(c.value)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: active ? '#EAF3DE' : '#f7faf4',
                      border: active ? '1.5px solid #639922' : '1px solid #d4e8c2',
                    }}
                  >
                    {/* Custom checkbox */}
                    <div
                      className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: active ? '#639922' : 'white',
                        border: `1.5px solid ${active ? '#639922' : '#C0DD97'}`,
                      }}
                    >
                      {active && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium" style={{ color: active ? '#27500A' : '#444441' }}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#27500A' }}
          >
            Simpan &amp; lanjutkan →
          </button>

        </form>
      </div>
    </div>
  );
}
