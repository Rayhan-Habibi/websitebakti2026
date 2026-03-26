import React from 'react';
import { FiEdit, FiXCircle } from 'react-icons/fi'; // Pastikan sudah install react-icons
import { useState } from 'react';
import RekapAbsenPopUp from './RekapAbsenPopUp'; // Pastikan path ini benar
// 1. FUNGSI PEMBANTU FORMATTING (Logika Frontend)
const formatKehadiran = (kehadiran) => {
  const hadirText = kehadiran.hadir !== null && kehadiran.hadir !== undefined ? kehadiran.hadir : "--";
  return `${hadirText}/${kehadiran.total}`;
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-[#00D419] text-white'; // Hijau terang (sesuai pie chart)
    case 'Inactive': return 'bg-[#D80000] text-white'; // Merah-jingga (sesuai pie chart)
    case 'Expired': return 'bg-[#888888] text-white'; // Abu-abu
    default: return 'bg-gray-200 text-gray-700';
  }
};

// 2. KOMPONEN UTAMA
function RekapAbsen({ data = [] }) {
  // DATA DUMMY SIMULASI BACKEND (Persis gambar)
  // Ini akan dipakai kalau props 'data' kosong (untuk demo)
  const dummyData = [
    { id: 1, no: 1, kegiatanName: "Rapat Divisi RnB 1", kehadiran: { hadir: 27, total: 30 }, status: 'Active' },
    { id: 2, no: 2, kegiatanName: "Rapat Global 1", kehadiran: { hadir: null, total: 100 }, status: 'Inactive' },
    { id: 3, no: 3, kegiatanName: "Rapat Divisi X SC", kehadiran: { hadir: 30, total: 30 }, status: 'Expired' },
  ];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKegiatanForEdit, setSelectedKegiatanForEdit] = useState("");

  // Gunakan data dari props jika ada, jika tidak pakai dummy
  const displayedData = data.length > 0 ? data : dummyData;

  return (
    // KONTAINER UTAMA: Putih, Rounded, Shadow, Padding besar
    <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-lg p-8 font-sans">
      
      {/* JUDUL SECTION (Hijau Tua Unand) */}
      <h2 className="text-3xl font-black text-[#004D25] mb-6 tracking-wide">
        Recap Absensi Anggota
      </h2>
      
      {/* GARIS PEMISAH ATAS */}
      <div className="w-full h-0.5 bg-[#004D25] mb-1"></div>

      {/* STRUKTUR TABEL (Murni CSS Flexbox, lebih responsive) */}
      <div className="flex flex-col">
        
        {/* HEADER TABEL (Hijau Tua, Font Bold) */}
        <div className="flex items-center text-center py-4 font-black text-[#004D25] text-md uppercase tracking-wider border-b-2 border-[#014421] mb-2 flex-shrink-0">
          <div className="w-[10%]">No.</div>
          <div className="w-[30%] text-left pl-2">Nama Kegiatan</div>
          <div className="w-[20%]">Jumlah Kehadiran</div>
          <div className="w-[40%] flex justify-start px-10 gap-12">
            <span>Status</span>
            <span className="opacity-0 hidden md:inline">Aksi</span> {/* Kosongkan di HP */}
          </div>
        </div>

        {/* BARIS DATA (Mapping) */}
        {displayedData.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center text-center py-2 font-semibold text-black/80 text-md border-b-2 border-[#014421] mb-1 group hover:bg-gray-50 transition-colors"
          >
            {/* No. (10%) */}
            <div className="w-[10%] text-black text-md font-bold">{item.no}</div>
            
            {/* Nama Kegiatan (30%, Bold, Rata Kiri) */}
            <div className="w-[30%] text-left pl-2 text-md font-bold text-black/90 truncate pr-2" title={item.kegiatanName}>
                {item.kegiatanName}
            </div>
            
            {/* Jumlah Kehadiran (20%, Font Besar Pudar) */}
            <div className="w-[20%] text-black/60 font-black text-md tracking-wide">{formatKehadiran(item.kehadiran)}</div>
            
            {/* Status & Aksi (40%, Dibuat flex horizontal) */}
            <div className="w-[40%] flex justify-center items-center gap-3">
              
              {/* Status Badge */}
              <div className={` w-26 h-8 items-center flex justify-center rounded-sm font-black text-sm uppercase shadow-md ${getStatusStyle(item.status)}`}>
                {item.status}
              </div>
              
              {/* Tombol Aksi (Edit & Cancel) - Sembunyi di Mobile kecil */}
              <div className="flex items-center gap-3 md:flex-row flex-col">
                {/* Tombol Edit (Feather Edit Icon) */}
                <button 
                  onClick={() => {
                    setSelectedKegiatanForEdit(item);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-2.5 bg-[#014421] text-white font-black text-md uppercase px-6 py-2.5 rounded-md shadow-md hover:bg-green-900 transition-colors">
                  <FiEdit className="text-md flex-shrink-0" />
                  <span className='hidden lg:inline text-xs'>Edit</span>
                </button>
                
                {/* Tombol Cancel (Feather X Icon) */}
                <button className="flex items-center gap-2.5 bg-[#EB0000] text-white font-black text-md uppercase px-6 py-2.5 rounded-md shadow-md hover:bg-red-800 transition-colors">
                  <FiXCircle className="text-md flex-shrink-0" />
                  <span className='hidden lg:inline text-xs'>Cancel</span>
                </button>
              </div>
              
            </div>
          </div>
        ))}

        {/* GARIS BANTU BAWAH */}

      </div>

      <RekapAbsenPopUp 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        kegiatanValue={selectedKegiatanForEdit?.kegiatanName} 
        absensiData={selectedKegiatanForEdit?.absensiData} 
      />
    </div>
  );
}

export default RekapAbsen;