import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../../Store/useAuthStore';
import bgDivisi from "../../../assets/DivisiBackground.webp"

export default function DataPanitiaPage() {
  // Data divisi (nantinya bisa didapat dari backend)

  const [isLoading, setIsLoading] = useState(false)
  const [dataDivisi, setDataDivisi] = useState([])
  const token = useAuthStore((state) => state.token);

  const getDivisi = useCallback(async () => {
    setIsLoading(true)
    try{
        const response = await axios.get("https://api.baktiunand2026.com/api/divisi", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDataDivisi(response.data.data)
        console.log("Data divisi berhasil di fecth")
    } catch (error){
      alert("Error dalam mengambil data divisi")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [token]) 

  useEffect(() => {
    getDivisi();
  }, [getDivisi]);

  return (
   <div className="min-h-screen bg-[#F8F9FA] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 w-full overflow-x-hidden">
      
      <h1 className="text-3xl md:text-4xl font-black text-center text-[#133F25] mb-8 md:mb-12">
        Data Panitia
      </h1>
      
      {/* Jika masih loading, tampilkan tulisan ini */}
      {isLoading && (
        <div className="text-center font-bold text-gray-500 animate-pulse">
          Memuat data divisi...
        </div>
      )}
      
      {/* Grid Cards */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
        {/* 🔥 3. MAP DATA ASLI DARI API */}
        {!isLoading && dataDivisi.map((divisi) => (
          <Link 
            key={divisi.id}
            to={`/panitia/data-panitia/${divisi.id}`} 
            state={{namaDivisi: divisi.nama_divisi}}
            className="relative w-full sm:w-64 h-28 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
            
            <img 
              // Beri gambar default jika backend tidak ngirim foto background
              src={bgDivisi} 
              alt={divisi.nama_divisi} 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h2 className="text-white text-xl md:text-2xl font-black tracking-widest uppercase drop-shadow-lg text-center px-2">
                {/* Sesuaikan dengan nama properti dari backend (biasanya nama_divisi) */}
                {divisi.nama_divisi || divisi.nama} 
              </h2>
            </div>
          </Link>
        ))}

        {/* Jika data kosong setelah loading */}
        {!isLoading && dataDivisi.length === 0 && (
           <div className="text-center font-bold text-gray-500 w-full mt-10">
              Belum ada data divisi.
           </div>
        )}
      </div>
    </div>
  );
}