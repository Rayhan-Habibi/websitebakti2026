import React, { useCallback, useEffect, useState } from 'react'; // Rapikan import useState
import { useParams, useLocation } from 'react-router-dom';
import { FiTrash2, FiPlus } from 'react-icons/fi'; 
import AddAnggotaPopUp from './AddAnggotaPopUp';
import SuccessPopUp from '../../../components/SuccessPopUp';
import useAuthStore from '../../../Store/useAuthStore';
import axios from 'axios';
import CancelModal from '../../../components/CancelModal';

export default function DetailDivisiPage() {
  const { namaDivisi } = useParams(); 
  const [panitiaData, setPanitiaData] = useState([]);
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading]  = useState(false);
  const location = useLocation();
  const namaDivisiTitle = location.state.namaDivisi;
  
  // Modal states
  const [cancelModal, setCancelModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // 🔥 1. STATE BARU: Untuk menyimpan ID panitia mana yang mau dihapus
  const [selectedIdDelete, setSelectedIdDelete] = useState(null);

  const fetchPanitiaData = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.baktiunand2026.com/api/panitia/divisi/${namaDivisi}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPanitiaData(response.data.data);
      } catch (error) {
        console.log("Ada error nich: "+ error);
        alert("Gagal mengambil data panitia");
      } finally {
        setIsLoading(false);
      }
    }, [namaDivisi, token]); // Jangan lupa token masukin dependency

  useEffect(() => {
    fetchPanitiaData();
  }, [fetchPanitiaData]);

  return (
    <div className="min-h-screen bg-[#F4F6F8] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 font-sans flex flex-col items-center w-full overflow-x-hidden">
      
      <div className="w-full max-w-6xl px-0 md:px-10">
        
        <h1 className="text-2xl md:text-3xl font-black text-center text-[#133F25] mb-6 tracking-wide">
          Data Panitia
        </h1>

        <div className="mb-6 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-black text-[#133F25] mb-1 tracking-widest uppercase">
            {namaDivisiTitle}
          </h2>
          <p className="text-lg md:text-xl font-bold text-[#133F25]/80 mb-3">
            Data Anggota
          </p>
          
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 md:gap-3 bg-[#388E3C] text-white font-semibold text-base md:text-lg px-3 py-2 md:px-4 md:py-2 rounded-xl shadow-sm hover:bg-green-700 transition-colors">
            <span className="bg-white text-[#388E3C] rounded-md p-0.5">
              <FiPlus className="text-base md:text-lg font-bold" />
            </span>
            Tambah Anggota
          </button>
        </div>

        <div className="bg-white w-full shadow-sm border border-gray-200 p-4 md:p-8">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] flex flex-col">
              
              <div className="flex items-center pb-3 border-b-[3px] border-black font-extrabold text-black text-sm uppercase">
                <div className="w-[10%] pl-2">No.</div>
                <div className="w-[40%]">Nama</div>
                <div className="w-[35%]">Fakultas</div>
                <div className="w-[15%] text-center">Aksi</div> 
              </div>

              <ul className="flex flex-col">
                {panitiaData.map((item, index) => (
                  <li 
                    key={item.id} 
                    className="flex items-center py-4 border-b border-gray-400 text-black text-[15px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-[10%] pl-2">{index + 1}</div>
                    <div className="w-[40%] truncate pr-2" title={item.nama}>{item.nama}</div>
                    <div className="w-[35%] truncate pr-2" title={item.fakultas}>{item.fakultas}</div>
                    
                    <div className="w-[15%] flex justify-center">
                      <button
                        onClick={()=> {
                          // 🔥 2. SIMPAN ID-NYA DULU, BARU BUKA MODAL
                          setSelectedIdDelete(item.id); 
                          setCancelModal(true);
                        }}
                        className="flex items-center gap-1.5 bg-[#D32F2F] text-white font-medium text-xs md:text-sm px-3 md:px-5 py-2 rounded-lg shadow-sm hover:bg-red-800 transition-colors active:scale-95">
                        <FiTrash2 className="text-base md:text-lg flex-shrink-0" />
                        <span className="hidden md:inline">Hapus</span>
                      </button>
                    </div>
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
           setIsAddModalOpen(false); // 🔥 Tadi kamu ketulis true, aku benerin jadi false ya biar modal tambahnya ketutup!
           setIsSuccessOpen(true);   
        }}
        onRefresh={fetchPanitiaData}
        divisiId={namaDivisi}
      />

      <SuccessPopUp 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message="Anggota Berhasil Ditambahkan!"
      />

      {/* 🔥 3. PANGGIL MODAL DELETE DENGAN PROP YANG LENGKAP */}
      <CancelModal 
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)} // Kasih tau cara nutupnya
        message={"Hapus Panitia?"}
        endpoint={"panitia"}
        id={selectedIdDelete} // Kasih tau ID siapa yang dihapus
        onRefresh={fetchPanitiaData} // Kasih HT (Walkie Talkie) buat refresh layar!
      />
    </div>
  );
}