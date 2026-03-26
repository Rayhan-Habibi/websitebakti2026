import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

function MissedOut({ tasks = [] }) {
  return (
    // BUNGKUS UTAMA: Ditambahkan h-full agar bisa sejajar ukurannya kalau dimasukkan ke dalam Grid
    <div className="w-full bg-white border-2 border-gray-200 shadow-sm overflow-hidden font-sans rounded-xl flex flex-col h-full">
      
      {/* HEADER MERAH GELAP */}
      {/* Menggunakan bg-[#991B1B] (merah gelap) agar persis dengan desain */}
      <div className="bg-[#991B1B] py-4 flex-shrink-0">
        <h2 className="text-white text-center text-3xl font-black tracking-widest">
          Missed Out
        </h2>
      </div>

      {/* DAFTAR TUGAS TERLEWATI */}
      {/* flex-grow agar background putih mengisi sisa ruang di bawahnya */}
      <ul className="flex flex-col flex-grow bg-white">
        {tasks.map((item, index) => (
          <li 
            key={index} 
            // Aku buat border bawahnya selalu muncul (tidak di-kondisikan) 
            // agar sesuai desain gambarmu yang menyisakan ruang kosong di bawah garis
            className="flex flex-col px-6 py-5 border-b-2 border-[#133F25]"
          >
            {/* BARIS ATAS: Judul, Deskripsi, dan Alert */}
            <div className="flex justify-between w-full">
              
              {/* KIRI: Bullet + Teks Konten */}
              <div className="flex items-start gap-4 lg:w-3/4 w-2/3">
                <div className="w-4 h-4 rounded-full bg-[#133F25] flex-shrink-0 mt-1.5"></div>
                
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[#133F25]">
                    {item.title}
                  </span>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* KANAN: Alert Warning */}
              <div className="flex items-start justify-end gap-2 text-red-600 font-bold text-sm lg:text-base whitespace-nowrap lg:w-1/4 w-1/3 mt-0.5">
                <FiAlertCircle className="text-xl lg:text-2xl stroke-[2.5]" />
                <span className="hidden md:inline">{item.alert}</span>
              </div>
            </div>

            {/* BARIS BAWAH: Tanggal ditarik ke kanan bawah */}
            <div className="flex flex-wrap justify-end gap-6 text-[14px] font-black mt-6 uppercase tracking-wide w-full pr-2">
              <span className="text-[#133F25]">Start Date : {item.startDate}</span>
              <span className="text-red-600">End Date : {item.endDate}</span>
            </div>
            
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default MissedOut;