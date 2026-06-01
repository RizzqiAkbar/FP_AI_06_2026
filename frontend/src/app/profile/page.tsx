"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../../types/user';

export default function ProfilePage() {
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
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Health Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" value={profile.age} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-green-500 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input type="number" name="weight" value={profile.weight} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-green-500 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input type="number" name="height" value={profile.height} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-green-500 focus:ring-green-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
          <select name="goal" value={profile.goal} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-green-500 focus:ring-green-500 outline-none">
            <option value="maintain">Maintain Weight</option>
            <option value="cutting">Cutting / Weight Loss</option>
            <option value="bulking">Bulking / Muscle Gain</option>
            <option value="fitness">General Fitness</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Health Conditions</label>
          <div className="space-y-3">
            {['Diabetes', 'Hipertensi', 'Kolesterol tinggi', 'Asam urat'].map(condition => (
              <label key={condition} className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
                <input type="checkbox" value={condition} checked={profile.conditions.includes(condition)} onChange={handleConditions} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-3 text-gray-700 font-medium">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Save & Continue to Scan
        </button>
      </form>
    </div>
  );
}
