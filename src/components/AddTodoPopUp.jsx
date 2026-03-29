import React, { use, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import useAuthStore from '../Store/useAuthStore';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';

export default function AddTodoPopUp({ isOpen, onClose, onSuccess }) {
  // 1. STATE UNTUK INPUT FORMULIR (Dinamis)
  const [type, setType] = useState('Rapat'); 
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const divisiId = useAuthStore((state) => state.user?.divisi_id);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token); // Ambil token dari Zustand Store

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); // Mulai loading saat submit
    const formattedTime = time ? `${time.replace(':', '.')} WIB` : '';


    const newKegiatan = { 
      nama_acara: name, 
      tanggal: date, 
      waktu: formattedTime, 
      tanggal_berakhir: endDate, 
      lokasi: place, 
      deskripsi: description,
      divisi_id: divisiId, 
    };

    const newTodo = {
      tugas: name,
      deskripsi: description,
      start_date: date,
      deadline: endDate, 
      divisi_id: divisiId,
    }

    try {
      if (type === 'Rapat') {
        await axios.post('https://api.baktiunand2026.com/api/kegiatan', newKegiatan, {
          headers: {
            Authorization: `Bearer ${token}`, // Ambil token langsung dari store
          },
        });
        console.log("Menambahkan Kegiatan Baru");
        // Bersihkan form
        setName('');
        setDate('');
        setTime('');
        setPlace('');
        setDescription('');
        setEndDate('');
        
        onSuccess();
      } else if (type === 'Tugas') {
        await axios.post('https://api.baktiunand2026.com/api/todos', newTodo, {
          headers: {
            Authorization: `Bearer ${token}`, // Ambil token langsung dari store
          },
        });
        console.log("Menambahkan Tugas Baru");
        // Bersihkan form
        setName('');
        setDate('');
        setTime('');
        setPlace('');
        setDescription('');
        setEndDate('');
        
        onSuccess();

      }
    } catch (error) {
      console.error("Error adding new Kegiatan:", error);
      alert("Gagal menambahkan Kegiatan. Silakan coba lagi.");
      return; // Hentikan eksekusi jika gagal
    } finally {
      // 3. MATIKAN LOADING MESKIPUN SUKSES/GAGAL
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 font-sans text-[#133F25]">
      <div className="bg-white w-full max-w-5xl rounded-md relative shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-all">
        {/* --- BAGIAN HEADER --- */}
        <div className="px-10 pt-4 pb-4 flex justify-start items-center flex-shrink-0 border-b-2 border-gray-100">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center gap-2.5 bg-[#133F25] text-white font-extrabold text-sm uppercase px-6 py-3 rounded-xl shadow-md hover:bg-green-900 transition-colors"
          >
            <FiArrowLeft className="text-sm flex-shrink-0" />
            <span className='m-0'>Back</span>
          </button>
        </div>

        {/* --- BAGIAN TENGAH / KONTEN --- */}
        <form className="py-5 px-10 overflow-y-auto flex-grow space-y-8">
          
          {/* 3. INPUT JENIS KEGIATAN */}
          <div className="w-full">
            <label className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Jenis Kegiatan
            </label>
            <div className="flex gap-4 items-center">
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

          {/* 🔥 5. GRID INPUT TANGGAL, PUKUL & TEMPAT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            
            <div className='flex flex-col gap-8'>
              {/* Input Tanggal Mulai */}
              <div>
                <label htmlFor="date" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                  Tanggal Dilaksanakan
                </label>
                <input 
                  id="date"
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                  required
                />
              </div>

              {/* Input Tanggal Berakhir */}
              <div>
                <label htmlFor="endDate" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                  Tanggal Berakhir 
                  <span className='block text-xs text-gray-400 lowercase'>(Untuk durasi absen)</span>
                </label>
                <input 
                  id="endDate"
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#133F25]/30 rounded-2xl px-4 py-2 text-sm font-semibold text-black focus:border-[#133F25] focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* 1. PERBAIKAN: Bungkus dengan Fragment <> </> */}
            {type === 'Rapat' && (
              <>
                {/* Input Pukul */}
                <div>
                  <label htmlFor="time" className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
                    Pukul
                  </label>
                  <input 
                    id="time"
                    type="time" 
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
              </>
            )}

          </div>

          {/* 6. INPUT DESKRIPSI */}
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

        </form>

        {/* --- BAGIAN FOOTER --- */}
        <div className="px-10 py-6 border-t border-gray-100 bg-white flex justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={handleSubmit} 
            // 2. PERBAIKAN: Validasi dinamis! Kalau Rapat minta semua, kalau Tugas minta 3 saja.
            disabled={
              isLoading || 
              !name || 
              !date || 
              !endDate || 
              (type === 'Rapat' && (!time || !place))
            } 
            className="flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white font-extrabold text-2xl uppercase px-16 py-4 rounded-xl shadow-md hover:from-green-600 hover:to-green-800 transition-all cursor-pointer transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin text-2xl" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Tambah</span>
            )}
          </button>
        </div>
      </div>
      </div>

  );
}