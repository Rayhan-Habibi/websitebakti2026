import React from 'react';

function PieChartAbsen({
  totalKegiatan = 0, 
  hadir = 0, 
  tidakHadir = 0, 
  izin = 0, 
  sakit = 0 
}) {
  
  // 1. LOGIKA MATEMATIKA PIE CHART
  const safeTotal = totalKegiatan > 0 ? totalKegiatan : 1; 

  const pctHadir = (hadir / safeTotal) * 100;
  const pctTidakHadir = (tidakHadir / safeTotal) * 100;
  const pctIzin = (izin / safeTotal) * 100;
  // Sisanya otomatis sakit sampai 100%

  // Titik berhentinya warna (Akumulasi)
  const stop1 = pctHadir; // Batas Hadir
  const stop2 = stop1 + pctTidakHadir; // Batas Hadir + Tidak Hadir
  const stop3 = stop2 + pctIzin; // Batas Hadir + Tidak Hadir + Izin

  // 2. RAKIT STRING GRADIENT NYA
  // Kalau totalKegiatan 0, kasih warna abu-abu aja full
  const gradientStyle = totalKegiatan === 0 
    ? 'conic-gradient(#E5E7EB 0% 100%)' 
    : `conic-gradient(
        #A7E3B4 0% ${stop1}%, 
        #F07E63 ${stop1}% ${stop2}%, 
        #A7EBF4 ${stop2}% ${stop3}%, 
        #F3CA6C ${stop3}% 100%
      )`;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-black mb-8 self-start text-[#004D25]">
        Riwayat Absensi
      </h2>
      
      {/* 3. TERAPKAN STYLE DINAMISNYA KE DALAM DIV */}
      <div 
        className="w-48 h-48 md:w-56 md:h-56 rounded-full mb-8 shadow-inner transition-all duration-500"
        style={{ background: gradientStyle }}
      ></div>

      {/* Keterangan Total */}
      <p className="font-black text-lg md:text-xl text-black mb-4 uppercase self-start">
        Total Kegiatan : {totalKegiatan}
      </p>
      
      <p className="font-black text-sm text-black mb-2 uppercase self-start">Ket :</p>
      
      {/* 4. LEGEND DITAMBAH SAKIT BIAR LENGKAP 4 WARNA */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full justify-start">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#A7E3B4] rounded-sm shadow-sm"></div>
          <span className="font-bold text-sm text-black">Hadir: {hadir}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#F07E63] rounded-sm shadow-sm"></div>
          <span className="font-bold text-sm text-black">Alpha: {tidakHadir}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#A7EBF4] rounded-sm shadow-sm"></div>
          <span className="font-bold text-sm text-black">Izin: {izin}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#F3CA6C] rounded-sm shadow-sm"></div>
          <span className="font-bold text-sm text-black">Sakit: {sakit}</span>
        </div>
      </div>
    </div>
  );
}

export default PieChartAbsen;