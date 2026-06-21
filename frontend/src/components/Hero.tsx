'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="flex items-center justify-center px-4"
      style={{ minHeight: '100vh' }}
    >
      <div className="max-w-2xl mx-auto text-center">

        {/* Hero Logo */}
        <div className="flex justify-center mb-6">
          <img src="/nutria.png" alt="Nutria Logo" className="h-16 md:h-24 w-auto object-contain" />
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{ backgroundColor: '#EAF3DE', color: '#27500A' }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          Analisis nutrisi berbasis AI
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ color: '#27500A' }}>
          Kabar gembira untuk kita semua,
        </h1>

        {/* Tagline */}
        <p className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#639922' }}>
          Nutrisi sekarang ada scan nya!
        </p>

        {/* Subtext */}
        <p className="text-base leading-relaxed max-w-lg mx-auto mb-10" style={{ color: '#5F5E5A' }}>
          Upload foto kemasan makananmu, dan dapatkan analisis nutrisi personal berbasis AI dalam hitungan detik.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/scan"
            className="px-7 py-3.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#27500A' }}
          >
            Mulai scan sekarang →
          </Link>
          <Link
            href="/profile"
            className="px-7 py-3.5 text-sm font-medium rounded-xl transition-colors"
            style={{
              backgroundColor: '#EAF3DE',
              color: '#27500A',
              border: '1px solid #C0DD97',
            }}
          >
            Lengkapi profil dulu →
          </Link>
        </div>

      </div>
    </section>
  );
}
