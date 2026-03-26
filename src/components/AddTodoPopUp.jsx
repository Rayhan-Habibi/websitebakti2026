import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi'; // Gunakan ikon panah kiri dari Feather Icons

export default function AddTodoPopUp({ isOpen, onClose, onSuccess }) {
  // 1. STATE UNTUK INPUT FORMULIR (Dinamis)
  const [type, setType] = useState('Rapat'); // Default: 'Rapat'
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');

  // JIKA MODAL TIDAK TERBUKA, JANGAN RENDER APA-APA
  if (!isOpen) return null;

  // FUNGSI UNTUK MENAMBAH (Submit Dummy)
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Satukan data formulir
    const newTodo = { type, name, time, place, description };
    
    // Log data ke konsol (untuk testing sekarang, nanti diganti Axios)
    console.log("Menambahkan To-Do Baru:", newTodo);
    
    // Bersihkan form
    setName('');
    setTime('');
    setPlace('');
    setDescription('');
    
    // Tutup modal
    onSuccess();
  };

  return (
    // Latar belakang buram (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 font-sans text-[#133F25]">
      
      {/* 2. KOTAK PUTIH MODAL */}
      {/* max-h-[95vh] dan overflow-hidden */}
      <div className="bg-white w-full max-w-5xl rounded-md relative shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-all">
        
        {/* --- BAGIAN HEADER (Sticky Top) --- */}
        <div className="px-10 pt-4 pb-4 flex justify-start items-center flex-shrink-0 border-b-2 border-gray-100">
          {/* Tombol Back Gradien Hijau */}
          <button 
            onClick={onClose}
            className="flex items-center gap-2.5 bg-[#133F25] text-white font-extrabold text-sm uppercase px-6 py-3 rounded-xl shadow-md hover:bg-green-900 transition-colors"
          >
            <FiArrowLeft className="text-sm flex-shrink-0" />
            <span className='m-0'>Back</span>
          </button>
        </div>

        {/* --- BAGIAN TENGAH / KONTEN (Scrollable Area) --- */}
        {/* overflow-y-auto */}
        <form onSubmit={handleSubmit} className="py-5 px-10 overflow-y-auto flex-grow space-y-8">
          
          {/* 3. INPUT JENIS KEGIATAN */}
          <div className="w-full">
            <label className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Jenis Kegiatan
            </label>
            <div className="flex gap-4 items-center">
              {/* Tombol Pilihan 'Rapat' */}
              <button 
                type="button"
                onClick={() => setType('Rapat')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all border-2 ${
                  type === 'Rapat' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Rapat
              </button>
              {/* Tombol Pilihan 'Tugas' */}
              <button 
                type="button"
                onClick={() => setType('Tugas')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all border-2 ${
                  type === 'Tugas' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Tugas
              </button>
            </div>
          </div>

          {/* 4. INPUT NAMA KEGIATAN */}
          <div className="w-full">
            <label htmlFor="name" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Nama Kegiatan
            </label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25]/30 rounded-xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
              required
            />
          </div>

          {/* 5. GRID INPUT WAKTU & TEMPAT */}
          {/* 1 Kolom di HP, 2 Kolom di Laptop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Input Waktu */}
            <div>
              <label htmlFor="time" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                Waktu
              </label>
              <input 
                id="time"
                type="text" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                required
              />
            </div>
            {/* Input Tempat */}
            <div>
              <label htmlFor="place" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                Tempat
              </label>
              <input 
                id="place"
                type="text" 
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                required
              />
            </div>
          </div>

          {/* 6. INPUT DESKRIPSI (TEXTAREA GEDE) */}
          <div className="w-full pb-6">
            <label htmlFor="description" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Deskripsi (Boleh Dikosongkan)
            </label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="w-full bg-white border-2 border-[#133F25]/30 rounded-xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0 resize-none"
            />
          </div>
          
          {/* Trik untuk Submit pakai tombol di Footer (Hidden Submit) */}
          <input type="submit" id="hiddenSubmit" className='hidden'/>

        </form>

        {/* --- BAGIAN FOOTER (Sticky Bottom) --- */}
        <div className="px-10 py-6 border-t border-gray-100 bg-white flex justify-end flex-shrink-0">
          {/* Tombol 'Tambah' Gradien Hijau (Submit) */}
          {/* Kita gunakan HTMLFor untuk memicu hidden submit di dalam form di atas */}
          <label 
            htmlFor="hiddenSubmit"
            className="flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-extrabold text-2xl uppercase px-16 py-4 rounded-xl shadow-md hover:from-green-600 hover:to-green-800 transition-all cursor-pointer transform active:scale-95"
          >
            <span>Tambah</span>
          </label>
        </div>

      </div>
    </div>
  );
}