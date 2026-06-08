"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../types/user';

export default function HealthForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'maintain',
    conditions: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleConditions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let newConditions = [...profile.conditions];
    if (checked) {
      newConditions.push(value);
    } else {
      newConditions = newConditions.filter(c => c !== value);
    }
    setProfile({ ...profile, conditions: newConditions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    router.push('/scan');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Your Health Profile</h2>
        <p className="text-gray-500">Help us personalize your nutrition recommendations.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 transition group-hover:text-green-600">Age</label>
            <input type="number" name="age" value={profile.age} onChange={handleChange} required className="w-full rounded-xl border-gray-200 shadow-sm p-4 border focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none bg-white text-gray-900 transition-all duration-200" placeholder="e.g. 25" />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 transition group-hover:text-green-600">Weight (kg)</label>
            <input type="number" name="weight" value={profile.weight} onChange={handleChange} required className="w-full rounded-xl border-gray-200 shadow-sm p-4 border focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none bg-white text-gray-900 transition-all duration-200" placeholder="e.g. 70" />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 transition group-hover:text-green-600">Height (cm)</label>
            <input type="number" name="height" value={profile.height} onChange={handleChange} required className="w-full rounded-xl border-gray-200 shadow-sm p-4 border focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none bg-white text-gray-900 transition-all duration-200" placeholder="e.g. 175" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition group-hover:text-green-600">Health Goal</label>
          <select name="goal" value={profile.goal} onChange={handleChange} className="w-full rounded-xl border-gray-200 shadow-sm p-4 border focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none bg-white text-gray-900 transition-all duration-200 cursor-pointer">
            <option value="maintain">Maintain Weight</option>
            <option value="cutting">Cutting / Weight Loss</option>
            <option value="bulking">Bulking / Muscle Gain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Medical Conditions</label>
          <div className="grid grid-cols-2 gap-4">
            {['Normal', 'Diabetes', 'Hipertensi', 'Kolesterol', 'Asam Urat'].map(condition => (
              <label key={condition} className={`flex items-center cursor-pointer p-4 border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${profile.conditions.includes(condition) ? 'border-green-500 bg-green-50/50 ring-2 ring-green-500/20' : 'border-gray-200 bg-white hover:border-green-300'}`}>
                <input type="checkbox" value={condition} checked={profile.conditions.includes(condition)} onChange={handleConditions} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors" />
                <span className="ml-3 text-gray-800 font-medium">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center items-center py-5 px-4 rounded-xl shadow-lg shadow-green-600/30 text-lg font-extrabold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 mt-4">
          Save & Continue to Scan <span className="ml-2">→</span>
        </button>
      </form>
    </div>
  );
}
