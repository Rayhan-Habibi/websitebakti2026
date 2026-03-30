import React, { useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';

export default function SuccessPopUp({ isOpen, onClose, message }) {
  
  // Menutup pop-up otomatis setelah 2 detik
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 font-sans">
      
      <div className="bg-white rounded-md p-12 shadow-2xl flex flex-col items-center justify-center transform transition-all animate-bounce-short">
        
        {/* KOTAK CEKLIS HIJAU */}
        <div className="w-28 h-28 bg-green-600 rounded-3xl flex items-center justify-center mb-8">
          <FiCheck className="text-white text-7xl stroke-[4]" />
        </div>

        {/* TEKS PESAN (Disesuaikan dengan desain baru) */}
        <h3 className="text-[22px] font-medium text-[#133F25] tracking-wide text-center">
          {message}
        </h3>
        
      </div>
    </div>
  );
}