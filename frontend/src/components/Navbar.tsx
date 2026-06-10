'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white" style={{ borderBottom: '0.5px solid #d4e8c2' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-[18px]" style={{ fontWeight: 500 }}>
            <span style={{ color: '#27500A' }}>Nutri</span>
            <span style={{ color: '#639922' }}>fy</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#fitur" className="text-sm hover:text-[#639922] transition-colors" style={{ color: '#5F5E5A' }}>
              Fitur
            </Link>
            <Link href="#cara-kerja" className="text-sm hover:text-[#639922] transition-colors" style={{ color: '#5F5E5A' }}>
              Cara kerja
            </Link>
            <Link href="#tentang" className="text-sm hover:text-[#639922] transition-colors" style={{ color: '#5F5E5A' }}>
              Tentang
            </Link>
          </div>

          {/* Profil button */}
          <div className="hidden md:block">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#27500A' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              Profil
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#5F5E5A' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white px-6 py-4 flex flex-col gap-3" style={{ borderTop: '0.5px solid #d4e8c2' }}>
          <Link href="#fitur" onClick={() => setMobileOpen(false)} className="py-2 text-sm" style={{ color: '#5F5E5A' }}>Fitur</Link>
          <Link href="#cara-kerja" onClick={() => setMobileOpen(false)} className="py-2 text-sm" style={{ color: '#5F5E5A' }}>Cara kerja</Link>
          <Link href="#tentang" onClick={() => setMobileOpen(false)} className="py-2 text-sm" style={{ color: '#5F5E5A' }}>Tentang</Link>
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white rounded-lg"
            style={{ backgroundColor: '#27500A' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            Profil
          </Link>
        </div>
      )}
    </nav>
  );
}
