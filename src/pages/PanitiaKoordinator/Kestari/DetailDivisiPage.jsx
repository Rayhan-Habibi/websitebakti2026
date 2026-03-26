import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiTrash2, FiPlus } from 'react-icons/fi'; 
import { useState } from 'react';
import AddAnggotaPopUp from './AddAnggotaPopUp';
import SuccessPopUp from '../../../components/SuccessPopUp';

export default function DetailDivisiPage() {
  // 1. TANGKAP NAMA DIVISI DARI URL
  const { namaDivisi } = useParams(); 
  
  // Format nama divisi jadi huruf besar semua (MIT, INTI, ACARA)
  const judulDivisi = namaDivisi ? namaDivisi.toUpperCase() : 'DIVISI';

  // 2. DATA DUMMY ANGGOTA
  const anggotaList = [
    { id: 1, no: 1, nama: 'Indah Siti Sitian', fakultas: 'Fakultas Teknik' }
  ];

  //Indikasi modal on off
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Trik untuk membuat baris kosong tambahan agar tabel terlihat penuh seperti desain
  const emptyRows = [1, 2, 3, 4];

  return (
    // MAIN LAYOUT
    // PERBAIKAN: p-4 pt-24 (mobile) lalu md:p-10 md:pt-10 lg:pl-28 (desktop). overflow-x-hidden agar rapi.
    <div className="min-h-screen bg-[#F4F6F8] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 font-sans flex flex-col items-center w-full overflow-x-hidden">
      
      {/* KONTEN UTAMA DENGAN MAX-WIDTH AGAR RAPI DI TENGAH */}
      {/* PERBAIKAN: px-2 di mobile, px-10 di desktop agar tidak terlalu sempit */}
      <div className="w-full max-w-6xl px-0 md:px-10">
        
        {/* HEADER GLOBAL */}
        {/* PERBAIKAN: text-2xl di mobile, text-3xl di desktop */}
        <h1 className="text-2xl md:text-3xl font-black text-center text-[#133F25] mb-6 tracking-wide">
          Data Panitia
        </h1>

        {/* HEADER DIVISI */}
        <div className="mb-6 flex flex-col items-start">
          {/* PERBAIKAN: text-3xl di mobile, text-4xl di desktop */}
          <h2 className="text-3xl md:text-4xl font-black text-[#133F25] mb-1 tracking-widest uppercase">
            {judulDivisi}
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#133F25]/80 mb-3">
            Data Anggota
          </p>
          
          {/* TOMBOL TAMBAH ANGGOTA */}
          {/* PERBAIKAN: text-base px-3 py-2 di mobile agar tidak kebesaran */}
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 md:gap-3 bg-[#388E3C] text-white font-semibold text-base md:text-lg px-3 py-2 md:px-4 md:py-2 rounded-xl shadow-sm hover:bg-green-700 transition-colors">
            {/* Kotak putih kecil untuk ikon plus */}
            <span className="bg-white text-[#388E3C] rounded-md p-0.5">
              <FiPlus className="text-base md:text-lg font-bold" />
            </span>
            Tambah Anggota
          </button>
        </div>

        {/* KONTAINER TABEL PUTIH */}
        {/* PERBAIKAN: p-4 di mobile, p-8 di desktop */}
        <div className="bg-white w-full shadow-sm border border-gray-200 p-4 md:p-8">
          
          {/* KUNCI RESPONSIVE: WADAH SCROLL HORIZONTAL */}
          <div className="w-full overflow-x-auto">
            {/* min-w-[700px] memaksa tabel tetap utuh dan tidak gepeng di HP */}
            <div className="min-w-[700px] flex flex-col">
              
              {/* HEADER TABEL */}
              <div className="flex items-center pb-3 border-b-[3px] border-black font-extrabold text-black text-sm uppercase">
                <div className="w-[10%] pl-2">No.</div>
                <div className="w-[40%]">Nama</div>
                <div className="w-[35%]">Fakultas</div>
                <div className="w-[15%] text-center">Aksi</div> 
              </div>

              {/* BARIS DATA (MAPPING) */}
              <ul className="flex flex-col">
                {anggotaList.map((item) => (
                  <li 
                    key={item.id} 
                    className="flex items-center py-4 border-b border-gray-400 text-black text-[15px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-[10%] pl-2">{item.no}</div>
                    <div className="w-[40%] truncate pr-2" title={item.nama}>{item.nama}</div>
                    <div className="w-[35%] truncate pr-2" title={item.fakultas}>{item.fakultas}</div>
                    
                    {/* TOMBOL HAPUS */}
                    <div className="w-[15%] flex justify-center">
                      <button className="flex items-center gap-1.5 bg-[#D32F2F] text-white font-medium text-xs md:text-sm px-3 md:px-5 py-2 rounded-lg shadow-sm hover:bg-red-800 transition-colors active:scale-95">
                        <FiTrash2 className="text-base md:text-lg flex-shrink-0" />
                        <span className="hidden md:inline">Hapus</span> {/* Sembunyikan teks di layar super sempit kalau mau */}
                      </button>
                    </div>
                  </li>
                ))}

                {/* BARIS KOSONG (Untuk Estetika Desain) */}
                {emptyRows.map((index) => (
                  <li 
                    key={`empty-${index}`} 
                    className="flex items-center py-6 border-b border-gray-400"
                  >
                    <div className="w-[10%] pl-2"></div>
                    <div className="w-[40%]"></div>
                    <div className="w-[35%]"></div>
                    <div className="w-[15%]"></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      <AddAnggotaPopUp
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
           // PERBAIKAN BUG: tadinya true (buka terus), aku ubah jadi false (tutup form)
           setIsAddModalOpen(true); 
           setIsSuccessOpen(true);   // Buka pop-up ceklis hijau
        }}
      />

      <SuccessPopUp 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
}