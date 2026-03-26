import React from 'react';
import { FiEdit, FiXCircle } from 'react-icons/fi'; 
import { useState } from 'react';
import RekapAbsenPopUp from './RekapAbsenPopUp'; 
import CancelIcon from './Icons/CancelIcon';
import EditIcon from './Icons/EditIcon';

// 1. FUNGSI PEMBANTU FORMATTING (Logika Frontend)
const formatKehadiran = (kehadiran) => {
  const hadirText = kehadiran.hadir !== null && kehadiran.hadir !== undefined ? kehadiran.hadir : "--";
  return `${hadirText}/${kehadiran.total}`;
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-[#00D419] text-white'; 
    case 'Inactive': return 'bg-[#D80000] text-white'; 
    case 'Expired': return 'bg-[#888888] text-white'; 
    default: return 'bg-gray-200 text-gray-700';
  }
};

// 2. KOMPONEN UTAMA
function RekapAbsen({ data = [] }) {
  const dummyData = [
    { id: 1, no: 1, kegiatanName: "Rapat Divisi RnB 1", kehadiran: { hadir: 27, total: 30 }, status: 'Active' },
    { id: 2, no: 2, kegiatanName: "Rapat Global 1", kehadiran: { hadir: null, total: 100 }, status: 'Inactive' },
    { id: 3, no: 3, kegiatanName: "Rapat Divisi X SC", kehadiran: { hadir: 30, total: 30 }, status: 'Expired' },
  ];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKegiatanForEdit, setSelectedKegiatanForEdit] = useState("");

  const displayedData = data.length > 0 ? data : dummyData;

  return (
    <div className="w-full bg-white border border-gray-100 rounded-md shadow-lg p-4 md:p-8 font-sans">
      
      <h2 className="text-2xl md:text-3xl font-black text-[#004D25] mb-4 md:mb-6 tracking-wide">
        Recap Absensi Anggota
      </h2>
      
      <div className="w-full h-0.5 bg-[#004D25] mb-2 md:mb-4"></div>

      {/* WADAH SCROLL HORIZONTAL KHUSUS MOBILE */}
      <div className="w-full overflow-x-auto pb-4">
        
        <div className="min-w-[700px] flex flex-col">
          
          {/* HEADER TABEL (Garis tetap border-[#014421]) */}
          <div className="flex items-center text-center py-4 font-black text-[#004D25] text-md uppercase tracking-wider border-b-2 border-[#014421] mb-2 flex-shrink-0">
            <div className="w-[8%]">No.</div>
            <div className="w-[32%] text-left pl-2">Nama Kegiatan</div>
            <div className="w-[20%]">Jumlah Kehadiran</div>
            <div className="w-[40%] flex justify-center gap-16">
              <span>Status</span>
              <span>Aksi</span> 
            </div>
          </div>

          {/* BARIS DATA */}
          {displayedData.map((item) => (
            <div 
              key={item.id} 
              // PERBAIKAN: Dikembalikan ke border-[#014421] persis kode aslimu!
              className="flex items-center text-center py-2 font-semibold text-black/80 text-md border-b-2 border-[#014421] mb-1 group hover:bg-gray-50 transition-colors"
            >
              <div className="w-[8%] text-black text-md font-bold">{item.no}</div>
              
              <div className="w-[32%] text-left pl-2 text-md font-bold text-black/90 truncate pr-2" title={item.kegiatanName}>
                  {item.kegiatanName}
              </div>
              
              <div className="w-[20%] text-black/60 font-black text-md tracking-wide">{formatKehadiran(item.kehadiran)}</div>
              
              <div className="w-[40%] flex justify-center items-center gap-6">
                
                <div className={`w-26 h-8 items-center flex justify-center rounded-sm font-black text-sm uppercase shadow-md ${getStatusStyle(item.status)}`}>
                  {item.status}
                </div>
                
                <div className="flex items-center gap-2">
                  
                  <button 
                    onClick={() => {
                      setSelectedKegiatanForEdit(item);
                      setIsEditModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#014421] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-green-900 transition-colors"
                  >
                    {/* Ukuran icon disesuaikan w-4 h-4 */}
                    <EditIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Edit</span>
                  </button>
                  
                  <button className="flex items-center gap-2 bg-[#EB0000] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-red-800 transition-colors">
                    {/* Ukuran icon disesuaikan w-4 h-4 */}
                    <CancelIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Cancel</span>
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
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