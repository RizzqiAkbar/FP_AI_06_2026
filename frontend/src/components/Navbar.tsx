import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">NutriGuard AI</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-green-600 font-medium">Home</Link>
            <Link href="/profile" className="text-gray-600 hover:text-green-600 font-medium">Profile</Link>
            <Link href="/scan" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Scan Food</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
