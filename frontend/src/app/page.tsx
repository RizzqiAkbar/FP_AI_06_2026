import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f7faf4', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Fitur */}
      <section id="fitur" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#639922' }}>
              Fitur Unggulan
            </span>
            <h2 className="text-2xl font-bold mt-2" style={{ color: '#27500A' }}>
              Semua yang kamu butuhkan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#EAF3DE' }}>
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Scan Cerdas</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                OCR otomatis membaca nutrition facts dari foto kemasan dengan akurasi tinggi — tidak perlu ketik manual.
              </p>
            </div>

            <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#EAF3DE' }}>
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Analisis Personal</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                Hasil analisis disesuaikan dengan kondisi kesehatanmu — diabetes, hipertensi, kolesterol, dan lainnya.
              </p>
            </div>

            <div className="bg-white rounded-[14px] p-6" style={{ border: '0.5px solid #d4e8c2' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#EAF3DE' }}>
                <svg className="w-5 h-5" fill="none" stroke="#639922" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>Rekomendasi AI</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>
                Saran konsumsi, peringatan bahan berbahaya, dan alternatif produk lebih sehat — semuanya dari AI.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara-kerja" className="py-20 px-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#639922' }}>
              Cara Kerja
            </span>
            <h2 className="text-2xl font-bold mt-2" style={{ color: '#27500A' }}>
              Tiga langkah mudah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Foto',
                desc: 'Foto kemasan produk makanan — bisa 1 foto atau 3 foto (depan, nutrition facts, bahan).',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                ),
              },
              {
                step: '2',
                title: 'AI Menganalisis',
                desc: 'OCR membaca informasi nutrisi, lalu AI menganalisis kandungan berdasarkan profilmu.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.421 2.798H4.42c-1.45 0-2.42-1.798-1.42-2.798L4.6 15.3" />
                ),
              },
              {
                step: '3',
                title: 'Lihat Hasil',
                desc: 'Dapatkan skor risiko, informasi nutrisi lengkap, dan rekomendasi personal dari AI.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                  style={{ backgroundColor: '#EAF3DE', color: '#27500A' }}
                >
                  {step}
                </div>
                <svg className="w-6 h-6 mx-auto mb-3" fill="none" stroke="#639922" strokeWidth={1.5} viewBox="0 0 24 24">
                  {icon}
                </svg>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#27500A' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5F5E5A' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/scan"
              className="inline-block px-8 py-3.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#27500A' }}
            >
              Coba sekarang →
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#639922' }}>
            Tentang Nutria
          </span>
          <h2 className="text-2xl font-bold mt-2 mb-5" style={{ color: '#27500A' }}>
            Misi kami
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#5F5E5A' }}>
            Nutria hadir untuk membantu semua orang membuat pilihan makanan yang lebih baik dan lebih sadar.
            Dengan teknologi OCR dan kecerdasan buatan, kami menganalisis kandungan nutrisi produk makanan
            sesuai kondisi dan tujuan kesehatan masing-masing pengguna — agar hidup sehat bisa dimulai dari
            hal kecil seperti membaca label makanan.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center text-sm"
        style={{ borderTop: '0.5px solid #d4e8c2', color: '#5F5E5A' }}
      >
        <span style={{ color: '#27500A', fontWeight: 500 }}>Nutri</span>
        <span style={{ color: '#639922', fontWeight: 500 }}>a</span>
        {' '}— Analisis nutrisi berbasis AI
      </footer>

    </div>
  );
}
