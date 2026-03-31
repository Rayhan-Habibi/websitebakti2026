import React, { useState, useEffect, useCallback } from 'react';
import api from '../../config/api';
import RekapAbsenPopUp from './RekapAbsenPopUp'; 
import CancelIcon from '../ui/Icons/CancelIcon';
import EditIcon from '../ui/Icons/EditIcon';
import CancelModal from '../ui/CancelModal';
import { FiLoader, FiPieChart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// 1. FUNGSI PEMBANTU FORMATTING (Logika Frontend)

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-white text-[#00D419]'; 
    case 'Inactive': return 'bg-white text-[#D80000]'; 
    case 'Expired': return 'bg-white text-[#888888]'; 
    default: return 'bg-gray-200 text-gray-700';
  }
};

// 2. KOMPONEN UTAMA
function RekapAbsen() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const itemsPerPage = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKegiatanForEdit, setSelectedKegiatanForEdit] = useState("");
  const [dataId, setDataId] = useState(null);
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

  const fetchKegiatan = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/absensi/rekap-kegiatan', {
         params: { page, limit: itemsPerPage }
      });
      const respData = response.data?.data;
      if (Array.isArray(respData)) {
          setData(respData);
          setTotalData(respData.length);
      } else if (respData && Array.isArray(respData.data)) {
          setData(respData.data);
          setTotalData(respData.total || respData.data.length);
      } else if (response.data && response.data.total !== undefined && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setTotalData(response.data.total);
      } else {
          setData([]);
          setTotalData(0);
      }
    } catch (error) {
      console.error("Gagal menarik Rekap Kegiatan:", error);
      setData([]);
      setTotalData(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKegiatan(1);
  }, [fetchKegiatan]);

  // Pagination Logic Server+Client Adaptif
  const totalPages = Math.ceil(totalData / itemsPerPage);
  const isAllDataReturned = data.length > itemsPerPage || data.length === totalData;
  const currentData = (isAllDataReturned && totalData > itemsPerPage) 
      ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
      : data;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalData);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchKegiatan(pageNumber);
    }
  };

  const handleRefresh = () => {
     fetchKegiatan(currentPage);
  };
  return (
    <div className="relative overflow-hidden w-full bg-white border border-gray-100 rounded-md shadow-lg p-4 md:p-8 font-sans min-h-[300px]">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
          <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
          <span className="font-bold text-[#014421]">Memuat Data Kegiatan...</span>
        </div>
      )}
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
          {currentData.length === 0 && !isLoading && (
              <div className="text-center py-6 font-semibold text-gray-500 italic border-b-2 border-[#014421]">
                  Belum ada kegiatan yang terekam.
              </div>
          )}
          {currentData.map((item, index) => {
            const status = item.status ? item.status.toLowerCase() : '';
            const isActive = status === 'active';
            const isInactive = status === 'inactive';
            const isExpired = status === 'expired';

            return (
            <div 
              key={item.id} 
              className="flex items-center text-center py-2 font-semibold text-black/80 text-md border-b-2 border-[#014421] mb-1 group hover:bg-gray-50 transition-colors"
            >
              <div className="w-[8%] text-black text-md font-bold">{indexOfFirstItem + index + 1}</div>
              
              <div className="w-[32%] text-left pl-2 text-md font-bold text-black/90 truncate pr-2" title={item.kegiatanName}>
                  {item.nama_kegiatan}
              </div>
              
              <div className="w-[20%] text-black/60 font-black text-md tracking-wide">{item.jumlah_kehadiran}</div>
              
              <div className="w-[40%] flex justify-center items-center gap-6">
                
                <div className={`w-26 h-8 items-center flex justify-center rounded-sm font-black text-sm uppercase ${getStatusStyle(item.status)}`}>
                  {item.status}
                </div>
                
                <div className="flex items-center gap-2">
                  
                  <button 
                    onClick={() => {
                      setModalMode('edit');
                      setSelectedKegiatanForEdit(item);
                      setIsEditModalOpen(true);
                      setDataId(item.id);
                      setNamaKegiatan(item.nama_kegiatan);
                    }}
                    disabled={isInactive || isExpired}
                    className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 bg-[#014421] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-green-900 transition-all duration-200 cursor-pointer hover:scale-105 disabled:hover:scale-100"
                  >
                    <EditIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Edit</span>
                  </button>
                  
                  <button
                    onClick={()=>{
                        setDataId(item.id)
                        setDeleteModalOpen(true)
                    }}
                    disabled={isActive || isExpired}
                    className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 bg-[#EB0000] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-red-800 transition-all duration-200 cursor-pointer hover:scale-105 disabled:hover:scale-100"
                  >
                    <CancelIcon className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Delete</span>
                  </button>

                  {/* NEW CHART BUTTON */}
                  <button
                    onClick={() => {
                        setModalMode('chart');
                        setSelectedKegiatanForEdit(item);
                        setIsEditModalOpen(true);
                        setDataId(item.id);
                        setNamaKegiatan(item.nama_kegiatan);
                    }}
                    disabled={isInactive}
                    className="disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 bg-[#1E3A8A] text-white font-black uppercase px-3 py-2 md:px-4 md:py-2.5 rounded-md shadow-md hover:bg-blue-900 transition-all duration-200 cursor-pointer hover:scale-105 disabled:hover:scale-100"
                  >
                    <FiPieChart className="w-4 h-4 flex-shrink-0" />
                    <span className='hidden lg:inline text-xs'>Chart</span>
                  </button>

                </div>
              </div>
            </div>
          )})}

        </div>
        
        {!isLoading && totalData > 0 && (
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
            <div className="text-xs font-medium text-gray-500">
               Menampilkan {indexOfFirstItem + 1} - {indexOfLastItem} dari {totalData} kegiatan
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 md:p-2 rounded-md transition-all duration-200 flex items-center justify-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#004D25] hover:bg-white hover:shadow-sm cursor-pointer'}`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1 px-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[28px] h-7 md:min-w-[32px] md:h-8 px-1 md:px-2 flex items-center justify-center rounded-md text-xs md:text-sm font-bold transition-all duration-200 ${currentPage === page ? 'bg-[#004D25] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-[#004D25] hover:shadow-sm'}`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={`ellipsis-${page}`} className="text-gray-400 px-1 text-xs">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 md:p-2 rounded-md transition-all duration-200 flex items-center justify-center ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#004D25] hover:bg-white hover:shadow-sm cursor-pointer'}`}
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <RekapAbsenPopUp 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        kegiatanId={dataId}
        absensiData={selectedKegiatanForEdit?.absensiData} 
        namaKegiatan={namaKegiatan}
        mode={modalMode}
      />
      <CancelModal
        isOpen={deleteModalOpen}
        onClose={()=> setDeleteModalOpen(false)}
        id={dataId}
        message="Hapus Kegiatan?"
        onRefresh={handleRefresh}
        endpoint={"kegiatan"}
      />
    </div>
  );
}

export default RekapAbsen;