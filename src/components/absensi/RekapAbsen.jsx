import React from 'react';
import { useState } from 'react';
import RekapAbsenPopUp from './RekapAbsenPopUp'; 
import CancelIcon from '../ui/Icons/CancelIcon';
import EditIcon from '../ui/Icons/EditIcon';
import CancelModal from '../ui/CancelModal';

// 1. FUNGSI PEMBANTU FORMATTING (Logika Frontend)

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-[#00D419] text-white'; 
    case 'Inactive': return 'bg-[#D80000] text-white'; 
    case 'Expired': return 'bg-[#888888] text-white'; 
    default: return 'bg-gray-200 text-gray-700';
  }
};

// 2. KOMPONEN UTAMA
function RekapAbsen({ data = [], onRefresh }) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKegiatanForEdit, setSelectedKegiatanForEdit] = useState("");
  const [dataId, setDataId] = useState(null);
  const [namaKegiatan, setNamaKegiatan] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);




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
          {data.map((item, index) => (
            <div 
              key={item.id} 
              // PERBAIKAN: Dikembalikan ke border-[#014421] persis kode aslimu!
              className="flex items-center text-center py-2 font-semibold text-black/80 text-md border-b-2 border-[#014421] mb-1 group hover:bg-gray-50 transition-colors"
            >
              <div className="w-[8%] text-black text-md font-bold">{index + 1}</div>
              
              <div className="w-[32%] text-left pl-2 text-md font-bold text-black/90 truncate pr-2" title={item.kegiatanName}>
                  {item.nama_kegiatan}
              </div>
              
              <div className="w-[20%] text-black/60 font-black text-md tracking-wide">{item.jumlah_kehadiran}</div>
              
              <div className="w-[40%] flex justify-center items-center gap-6">
                
                <div className={`w-26 h-8 items-center flex justify-center rounded-sm font-black text-sm uppercase shadow-md ${getStatusStyle(item.status)}`}>
                  {item.status}
                </div>
                
                <div className="flex items-center gap-2">
                  
                  <button 
                    onClick={() => {
                      setSelectedKegiatanForEdit(item);
                      setIsEditModalOpen(true);
                      setDataId(item.id)
                      setNamaKegiatan(item.nama_kegiatan)
                    }}
                    disabled={item.status === "active"}
                    className="disabled:bg-gray-400 flex items-center gap-2 bg-[#014421] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-green-900 transition-colors"
                  >
                    {/* Ukuran icon disesuaikan w-4 h-4 */}
                    <EditIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Edit</span>
                  </button>
                  
                  <button
                    onClick={
                      ()=>{
                        setDataId(item.id)
                        setDeleteModalOpen(true)
                      }

                    }
                  className="flex items-center gap-2 bg-[#EB0000] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-red-800 transition-colors">
                    {/* Ukuran icon disesuaikan w-4 h-4 */}
                    <CancelIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Delete</span>
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
        kegiatanId={dataId}
        absensiData={selectedKegiatanForEdit?.absensiData} 
        namaKegiatan={namaKegiatan}
      />
      <CancelModal
        isOpen={deleteModalOpen}
        onClose={()=> setDeleteModalOpen(false)}
        id={dataId}
        message="Hapus Kegiatan?"
        onRefresh={onRefresh}
        endpoint={"kegiatan"}
      />
    </div>
  );
}

export default RekapAbsen;