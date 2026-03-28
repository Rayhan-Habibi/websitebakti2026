import axios from 'axios';
import React, { useState } from 'react';
import { FiArrowLeft, FiLoader } from 'react-icons/fi'; // Tambah icon loader
import useAuthStore from '../../../Store/useAuthStore';

export default function AddAnggotaPopUp({ isOpen, onClose, onSuccess, divisiId, onRefresh }) {
  const [nama, setNama] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [nim, setNim] = useState(''); // Jadikan string kosong sebagai default
  const [role, setRole] = useState("PANITIA");
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post(`https://api.baktiunand2026.com/api/panitia`, {
        nama: nama,
        nim: nim,
        divisi_id: divisiId, // PASTIKAN komponen induk melempar ID ini ke modal ya!
        role: role,
        fakultas: fakultas
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Data panitia sukses dikirim");

      // 🔥 INI DIA SIHIRNYA: Panggil onRefresh setelah data sukses masuk!
      if (onRefresh) onRefresh();

      // Bersihkan form
      setNama('');
      setNim('');
      setFakultas('');
      setRole('PANITIA');
      
      // Tutup modal dan munculkan ceklis hijau
      onSuccess();

    } catch (error) {
      const status = error.response.status
      if (status === 403){
        alert("Hanya kestari yang dapat mengisi form panitia");
      } else{
         console.log("Ada error pls: " + error);
        alert("Gagal menambahkan data panitia. Cek koneksimu.");
      }
     
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-[#133F25]">
      
      <div className="bg-white w-full max-w-4xl rounded-3xl relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all">
        
        {/* --- HEADER --- */}
        <div className="px-10 pt-10 pb-4 flex justify-start items-center flex-shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-2.5 bg-[#388E3C] text-white font-extrabold text-lg px-6 py-2.5 rounded-xl shadow-md hover:bg-green-700 transition-colors"
          >
            <FiArrowLeft className="text-2xl flex-shrink-0" />
            <span className='m-0'>Back</span>
          </button>
        </div>

        {/* --- KONTEN FORM --- */}
        <form onSubmit={handleSubmit} className="px-10 py-6 overflow-y-auto flex-grow space-y-8">

          {/* INPUT ROLE */}
           <div className="w-full">
            <label className="block text-md font-bold text-[#133F25] mb-2 uppercase tracking-wide">
              Jabatan
            </label>
            <div className="flex gap-4 items-center">
              <button 
                type="button"
                onClick={() => setRole('PANITIA')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all border-2 ${
                  role === 'PANITIA' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Panitia
              </button>
              <button 
                type="button"
                onClick={() => setRole('PRESIDIUM')}
                className={`px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition-all border-2 ${
                  role === 'PRESIDIUM' 
                    ? 'border-[#133F25] text-[#133F25] bg-white' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 hover:bg-white hover:text-[#133F25]'
                }`}
              >
                Koordinator
              </button>
            </div>
          </div>
          
          {/* INPUT NAMA */}
          <div className="w-full">
            <label htmlFor="nama" className="block text-xl font-bold text-[#133F25] mb-2">
              Nama
            </label>
            <input 
              id="nama"
              type="text" 
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25] rounded-2xl px-4 py-2 text-md font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#388E3C]/50"
              required
            />
          </div>

          {/* INPUT NIM (ID diperbaiki jadi 'nim') */}
          <div className="w-full">
            <label htmlFor="nim" className="block text-2xl font-bold text-[#133F25] mb-2">
              NIM
            </label>
            <input 
              id="nim"
              type="number" 
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full bg-white border-2 border-[#133F25] rounded-2xl px-4 py-2 text-md font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#388E3C]/50"
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
              className="w-full bg-white border-2 border-[#133F25] rounded-2xl px-4 py-2 text-md font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#388E3C]/50"
              required
            />
          </div>
          
          {/* Trik Submit Tersembunyi */}
          <input type="submit" id="submitAnggota" className='hidden'/>

        </form>

        {/* --- FOOTER --- */}
        <div className="px-10 py-8 flex justify-end flex-shrink-0">
          <label 
            htmlFor="submitAnggota"
            // Kalau lagi loading, bikin tombolnya agak transparan & cursor not-allowed biar gak diklik dobel
            className={`flex items-center gap-2.5 bg-gradient-to-r from-[#8CE3A9] to-[#388E3C] text-white font-extrabold text-2xl px-12 py-3.5 rounded-xl shadow-md transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer transform active:scale-95'}`}
          >
            {isLoading ? <FiLoader className="animate-spin text-2xl" /> : <span>Tambah</span>}
          </label>
        </div>

      </div>
    </div>
  );
}