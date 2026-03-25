import React from 'react';

export default function Absensi() {
  return (
    // BUNGKUS UTAMA: pl-24 untuk memberi ruang pada sidebar di desktop
    // Di mobile (layar kecil), kita kurangi padding-nya agar lebih lega
    <div className="min-h-screen bg-[#F1F3F4] p-6 lg:p-10 lg:pl-24 font-sans text-[#133F25]">
      
      {/* --- HEADER --- */}
      <div className="relative flex justify-center items-center mb-10 mt-4">
        {/* Judul dengan efek text-shadow tipis biar mirip desain */}
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest drop-shadow-sm">
          ABSENSI
        </h1>
        
        {/* Badge User di Kanan Atas */}
        <div className="absolute right-0 flex flex-col items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#67E8F9] rounded-xl shadow-sm"></div>
          <span className="text-xs md:text-sm font-black mt-1 uppercase">MIT</span>
        </div>
      </div>

      {/* --- GRID UTAMA --- */}
      {/* 1 Kolom di HP, 2 Kolom di Laptop (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KARTU 1: QR ABSENSI */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8 self-start">
            Qr Absensi Kamu
          </h2>
          
          {/* Container QR Code */}
          <div className="relative p-2 border-4 border-black rounded-2xl mb-8">
            {/* Gambar QR Dummy */}
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NayAbsensiBakti" 
              alt="QR Absensi" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
            {/* Tempat Logo Unand di Tengah QR */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md shadow-md">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded border border-green-800 text-[10px] font-bold text-center">
                LOGO UNAND
              </div>
            </div>
          </div>

          {/* Garis Pembatas */}
          <div className="w-full h-0.5 bg-[#133F25] mb-6"></div>

          {/* Nama Mahasiswa */}
          <h3 className="text-xl md:text-2xl font-black text-center">
            Nay Rangers
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 bg-[#67E8F9] rounded-sm"></div>
            <span className="font-bold text-sm md:text-base">Anggota MIT</span>
          </div>
        </div>

        {/* KARTU 2: RIWAYAT ABSENSI */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8 self-start">
            Riwayat Absensi
          </h2>
          
          {/* Pie Chart Murni CSS (Conic Gradient) */}
          {/* Persentase warna disesuaikan agar mirip dengan desainmu */}
          <div 
            className="w-48 h-48 md:w-56 md:h-56 rounded-full mb-8 shadow-inner"
            style={{ 
              background: 'conic-gradient(#A7E3B4 0% 35%, #F07E63 35% 55%, #A7EBF4 55% 75%, #F3CA6C 75% 100%)' 
            }}
          ></div>

          {/* Keterangan */}
          <p className="font-black text-lg md:text-xl text-black mb-4 uppercase">
            Total Kegiatan : 4
          </p>
          
          <p className="font-black text-sm text-black mb-2 uppercase">Ket :</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#A7E3B4] rounded-sm shadow-sm"></div>
              <span className="font-bold text-sm text-black">Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#F07E63] rounded-sm shadow-sm"></div>
              <span className="font-bold text-sm text-black">Tidak Hadir</span>
            </div>
          </div>
        </div>

        {/* KARTU 3: TATA CARA ABSENSI */}
        {/* col-span-1 di HP, col-span-2 di Laptop (membentang penuh) */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200 lg:col-span-2 mt-2">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Tata Cara Absensi
          </h2>
          
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base font-semibold text-black/80">
            <li>Lorem Ipsum is a dummy or placeholder text used in publishing and design to simulate content while focusing on layout and typography.</li>
            <li>Lorem Ipsum is a dummy or placeholder text used in publishing.</li>
            <li>publishing and design to simulate content while focusing on layout and typography.</li>
            <li>balal aoowdm a?n anowdmoamd amowmo dmawm dowa</li>
          </ol>
        </div>

      </div>
    </div>
  );
}