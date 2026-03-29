import React, { useState } from 'react';
import api from '../../config/api';
import CancelIcon from './Icons/CancelIcon';

function CancelModal({ message = "Hapus Kegiatan?", isOpen, onClose, id, onRefresh, endpoint }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/api/${endpoint}/${id}`);
      
      if (onRefresh) onRefresh(); 
      onClose();

    } catch (error) {
      console.error(error);
      alert("Kegiatan gagal dihapus. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-[#133F25]">
      <div className="bg-white rounded-md p-10 md:p-14 shadow-2xl flex flex-col items-center justify-center transform transition-all animate-bounce-short text-center">
        
        <div className="text-6xl text-white w-28 h-28 bg-[#E25C5C]/20 rounded-3xl flex items-center justify-center mb-8">
          !
        </div>

        <h3 className="text-[22px] font-bold text-[#133F25] tracking-wide mb-8">
          {message}
        </h3>
        
        <div className="flex gap-4 w-full justify-center">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-6 font-black text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50 uppercase text-xs shadow-md"
          >
            Batal
          </button>
          <button 
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-3 px-6 font-black text-white bg-[#EB0000] hover:bg-red-800 rounded-md transition-colors disabled:opacity-50 uppercase text-xs shadow-md"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CancelModal;