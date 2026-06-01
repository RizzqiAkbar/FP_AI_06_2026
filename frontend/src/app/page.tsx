import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
        Your Personalized <span className="text-green-600">Food Safety</span> Assistant
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        Stop guessing. Get instant, AI-powered nutritional analysis customized to your exact health profile, goals, and dietary needs.
      </p>
      <div className="flex gap-4">
        <Link href="/profile" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg">
          Set Up Profile
        </Link>
        <Link href="/scan" className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200">
          Scan Now
        </Link>
      </div>
    </div>
  );
}
