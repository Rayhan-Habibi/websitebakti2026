import React, { useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';

export default function SuccessScanPopUp({ isOpen, onClose }) {
  


  // EFEK SAKTI: Menutup pop-up otomatis setelah 2 detik
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); // Panggil fungsi tutup dari bapaknya
      }, 2000); // 2000 milidetik = 2 detik

      // Bersihkan timer kalau komponen tiba-tiba dibongkar (unmount)
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Kalau state isOpen false, jangan render apa-apa
  if (!isOpen) return null;

  return (
    // Latar belakang buram tipis
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 font-sans">
      
      {/* Kotak Putih Tengah */}
      {/* Tambahkan animasi pop-in agar munculnya lebih halus */}
      <div className="bg-white rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center transform transition-all animate-bounce-short">
        
        {/* KOTAK CEKLIS HIJAU */}
        {/* Menggunakan warna hijau lembut seperti di desain */}
        <div className="w-28 h-28 bg-[#8CE3A9] rounded-3xl flex items-center justify-center mb-8">
          {/* Ikon Ceklis dengan ketebalan garis (stroke) ekstra */}
          <FiCheck className="text-white text-7xl stroke-[4]" />
        </div>

        {/* TEKS PESAN */}
        <h3 className="text-[22px] font-medium text-[#133F25] tracking-wide text-center">
          Absensi Berhasil Di Ambil
        </h3>
        
      </div>
    </div>
  );
}