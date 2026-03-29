import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../../Store/useAuthStore';
import api from '../../../config/api';
import bgDivisi from "../../../assets/DivisiBackground.webp"

export default function DataPanitiaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataDivisi, setDataDivisi] = useState([]);
  const token = useAuthStore((state) => state.token);

  const getDivisi = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/divisi");
      setDataDivisi(response.data.data);
    } catch (error) {
      alert("Error dalam mengambil data divisi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getDivisi();
  }, [getDivisi]);

  return (
   <div className="min-h-screen bg-[#F8F9FA] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 w-full overflow-x-hidden">
      
      <h1 className="text-3xl md:text-4xl font-black text-center text-[#133F25] mb-8 md:mb-12">
        Data Panitia
      </h1>
      
      {isLoading && (
        <div className="text-center font-bold text-gray-500 animate-pulse">
          Memuat data divisi...
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
        {!isLoading && dataDivisi.map((divisi) => (
          <Link 
            key={divisi.id}
            to={`/panitia/data-panitia/${divisi.id}`} 
            state={{namaDivisi: divisi.nama_divisi}}
            className="relative w-full sm:w-64 h-28 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
            
            <img 
              src={bgDivisi} 
              alt={divisi.nama_divisi} 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
            />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h2 className="text-white text-xl md:text-2xl font-black tracking-widest uppercase drop-shadow-lg text-center px-2">
                {divisi.nama_divisi || divisi.nama} 
              </h2>
            </div>
          </Link>
        ))}

        {!isLoading && dataDivisi.length === 0 && (
           <div className="text-center font-bold text-gray-500 w-full mt-10">
              Belum ada data divisi.
           </div>
        )}
      </div>
    </div>
  );
}