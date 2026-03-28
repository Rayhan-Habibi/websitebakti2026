import React from 'react';
import { FiAlertCircle, FiCheck,FiClock, FiMapPin } from 'react-icons/fi'; 

// Tambahkan onToggle di props biar bisa nyentang tugas telat
function MissedOut({ tasks = [], onToggle }) {
  if (tasks.length === 0) return null; // Sembunyikan jika tidak ada tugas yang telat

  return (
    // BUNGKUS UTAMA
    <div className="w-full bg-white border-2 border-[#991B1B] shadow-sm overflow-hidden font-sans rounded-xl flex flex-col h-full">
      
      {/* HEADER MERAH GELAP */}
      <div className="bg-[#991B1B] py-4 flex-shrink-0">
        <h2 className="text-white text-center text-2xl md:text-4xl font-black tracking-widest">
          MISSED OUT
        </h2>
      </div>

      {/* DAFTAR TUGAS TERLEWATI */}
      <ul className="flex flex-col flex-grow bg-white">
        {tasks.map((item) => (
          <li 
            key={item.unique_id} 
            className="flex flex-col px-6 py-5 border-b-2 border-[#133F25] hover:bg-red-50 transition-colors"
          >
            {/* BARIS ATAS: Judul, Deskripsi, dan Alert */}
            <div className="flex justify-between w-full">
              
              {/* KIRI: Checkbox + Teks Konten */}
              <div className="flex items-start gap-4 lg:w-3/4 w-2/3">
                
                {/* UBAH BULLET JADI CHECKBOX */}
                <button 
                  onClick={() => onToggle && onToggle(item.id, item.is_done)}
                  className="w-6 h-6 rounded flex-shrink-0 mt-1 border-2 border-[#133F25] flex items-center justify-center transition-colors hover:bg-gray-200"
                  title="Selesaikan Tugas Terlambat"
                >
                  {item.is_done && <FiCheck className="text-[#133F25] text-lg font-bold" />}
                </button>
                
                <div className="flex flex-col">
                  {/* Penamaan disesuaikan dengan skema backend */}
                  <span className="text-xl font-bold text-[#133F25]">
                    {item.judul_tugas}
                  </span>
                  
                  {/* Deskripsi (jika ada) */}
                  {item.deskripsi && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  )}
                </div>
              </div>

              {/* KANAN: Alert Warning ("Sisa X Hari" atau "Tenggat Terlewati") */}
              {item.alert && (
                <div className="flex items-start justify-end gap-2 text-red-600 font-bold text-sm lg:text-base whitespace-nowrap lg:w-1/4 w-1/3 mt-0.5">
                  <FiAlertCircle className="text-xl lg:text-2xl stroke-[2.5]" />
                  <span className="hidden md:inline">{item.alert}</span>
                </div>
              )}
            </div>

            {/* BARIS BAWAH: Tanggal ditarik ke kanan bawah */}
            {/* --- KONDISI 1: JIKA INI ADALAH TUGAS (TODO) --- */}
                    {item.tipe_item === 'todo' && item.tanggal_mulai && item.tanggal_selesai && (
                      <div className={`flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black mt-4 uppercase tracking-wide ${
                         item.is_done ? 'opacity-50' : ''
                      }`}>
                        <span className="text-[#133F25]">
                          Start: {item.tanggal_mulai.split('T')[0]}
                        </span>
                        <span className="text-[#EB0000]">
                          Deadline: {item.tanggal_selesai.split('T')[0]}
                        </span>
                      </div>
                    )}

                    {/* --- KONDISI 2: JIKA INI ADALAH KEGIATAN (RAPAT/DLL) --- */}
                    {item.tipe_item === 'kegiatan' && (
                      <div className={`flex flex-col gap-3 mt-4 ${item.is_done ? 'opacity-50' : ''}`}>
                        
                        {/* Tanggal Kegiatan */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black uppercase tracking-wide">
                          <span className="text-[#133F25]">
                            Tgl: {item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '-'}
                          </span>
                          {/* Jika kegiatan ada tanggal selesainya juga, kita tampilkan */}
                          {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai && (
                            <span className="text-[#EB0000]">
                              Sampai: {item.tanggal_selesai.split('T')[0]}
                            </span>
                          )}
                        </div>

                        {/* Jam dan Lokasi (Pakai Icon) */}
                        <div className="flex flex-wrap gap-6 text-sm font-semibold text-[#133F25]">
                          {item.waktu && (
                            <div className="flex items-center gap-1.5">
                              <FiClock className="text-lg" /> 
                              {item.waktu}
                            </div>
                          )}
                          {item.lokasi && (
                            <div className="flex items-center gap-1.5">
                              <FiMapPin className="text-lg" /> 
                              {item.lokasi}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
            
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default MissedOut;