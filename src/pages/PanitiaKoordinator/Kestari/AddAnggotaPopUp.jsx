import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function AddAnggotaPopUp({ isOpen, onClose, onSuccess }) {
  // 1. STATE UNTUK INPUT FORMULIR
  const [nama, setNama] = useState('');
  const [fakultas, setFakultas] = useState('');

  // Jika modal tidak disuruh buka, jangan render apa-apa
  if (!isOpen) return null;

  // 2. FUNGSI SUBMIT (Simulasi kirim ke Backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const anggotaBaru = { nama, fakultas };
    
    // Nanti axios.post() di sini
    console.log("Menambahkan Anggota Baru:", anggotaBaru);
    
    // Bersihkan form agar kosong saat dibuka lagi
    setNama('');
    setFakultas('');
    
    // Panggil onSuccess untuk menutup modal ini dan memunculkan pop-up sukses
    onSuccess();
  };

  return (
    // Latar belakang buram (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-[#133F25]">
      
      {/* KOTAK PUTIH MODAL (Max width disesuaikan agar tidak terlalu lebar untuk 2 input saja) */}
      <div className="bg-white w-full max-w-4xl rounded-3xl relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all">
        
        {/* --- BAGIAN HEADER (Sticky Top) --- */}
        <div className="px-10 pt-10 pb-4 flex justify-start items-center flex-shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-2.5 bg-[#388E3C] text-white font-extrabold text-lg px-6 py-2.5 rounded-xl shadow-md hover:bg-green-700 transition-colors"
          >
            {/* Menggunakan ikon panah biasa agar lebih universal, tapi styling mirip gambarmu */}
            <FiArrowLeft className="text-2xl flex-shrink-0" />
            <span className='m-0'>Back</span>
          </button>
        </div>

        {/* --- BAGIAN TENGAH / KONTEN (Scrollable Area) --- */}
        <form onSubmit={handleSubmit} className="px-10 py-6 overflow-y-auto flex-grow space-y-8">
          
          {/* INPUT NAMA */}
          <div className="w-full">
            <label htmlFor="nama" className="block text-2xl font-bold text-[#133F25] mb-2">
              Nama
            </label>
            <input 
              id="nama"
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25] rounded-2xl px-6 py-4 text-xl font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#388E3C]/50"
              required
            />
          </div>

          {/* INPUT FAKULTAS */}
          <div className="w-full pb-6">
            <label htmlFor="fakultas" className="block text-2xl font-bold text-[#133F25] mb-2">
              Fakultas
            </label>
            <input 
              id="fakultas"
              type="text" 
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25] rounded-2xl px-6 py-4 text-xl font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#388E3C]/50"
              required
            />
          </div>
          
          {/* Trik Submit Tersembunyi */}
          <input type="submit" id="submitAnggota" className='hidden'/>

        </form>

        {/* --- BAGIAN FOOTER (Sticky Bottom) --- */}
        <div className="px-10 py-8 flex justify-end flex-shrink-0">
          <label 
            htmlFor="submitAnggota"
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#8CE3A9] to-[#388E3C] text-white font-extrabold text-2xl px-12 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-95"
          >
            <span>Tambah</span>
          </label>
        </div>

      </div>
    </div>
  );
}