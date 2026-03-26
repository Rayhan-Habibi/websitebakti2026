import React from 'react';
import { Link } from 'react-router-dom';

export default function DataPanitiaPage() {
  // Data divisi (nantinya bisa didapat dari backend)
  const divisiList = [
    { id: 'inti', nama: 'INTI', bgImg: '/assets/LoginBackground.webp' },
    { id: 'mit', nama: 'MIT', bgImg: '/assets/LoginBackground.webp' },
    { id: 'acara', nama: 'ACARA', bgImg: '/assets/LoginBackground.webp' },
    { id: 'kestari', nama: 'Kestari', bgImg: '/assets/LoginBackground.webp' },
    // ... divisi lainnya
  ];

  return (
    // PERBAIKAN RESPONSIVE: p-4 pt-24 (mobile) lalu md:p-10 md:pt-10 (desktop). lg:pl-28 agar aman dari sidebar.
    <div className="min-h-screen bg-[#F8F9FA] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 w-full overflow-x-hidden">
      
      {/* PERBAIKAN: text-3xl di mobile, text-4xl di desktop. Margin bawah sedikit dikurangi di mobile */}
      <h1 className="text-3xl md:text-4xl font-black text-center text-[#133F25] mb-8 md:mb-12">
        Data Panitia
      </h1>
      
      {/* Grid Cards */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
        {divisiList.map((divisi) => (
          <Link 
            key={divisi.id}
            to={`/panitia/data-panitia/${divisi.id}`} // <--- URL Tujuan Dinamis
            // PERBAIKAN: w-full sm:w-64 agar di HP tampil penuh (full width), di layar agak besar kembali jadi w-64
            className="relative w-full sm:w-64 h-28 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            {/* Background Image Hitam Transparan */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
            
            <img 
              src={divisi.bgImg} 
              alt={divisi.nama} 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            />
            
            {/* Text Judul Divisi */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              {/* PERBAIKAN: text-2xl di mobile, text-3xl di desktop */}
              <h2 className="text-white text-2xl md:text-3xl font-black tracking-widest uppercase drop-shadow-lg">
                {divisi.nama}
              </h2>
            </div>
            
          </Link>
        ))}
      </div>
    </div>
  );
}