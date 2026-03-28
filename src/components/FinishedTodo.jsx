import React, { useState, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';

function FinishedTodo({ tasks = [], onToggle }) {
  
  // STATE LOKAL UNTUK OPTIMISTIC UI
  const [localTasks, setLocalTasks] = useState([]);

  // Sinkronkan data dari parent
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  if (tasks.length === 0) return null; // Jangan render apa-apa kalau keranjang finished kosong

  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      {/* KONTAINER UTAMA FINISHED */}
      <div className="h-full flex flex-col border-2 border-[#A3A3A3] shadow-sm overflow-hidden rounded-xl">
        
        {/* HEADER ABU-ABU */}
        <div className="bg-[#A3A3A3] py-4 md:py-4 flex items-center justify-center p-2 relative flex-shrink-0">
          <h2 className="text-2xl md:text-4xl text-center w-full font-bold text-white z-10">
            Finished
          </h2>
        </div>

        {/* DAFTAR TUGAS SELESAI */}
        <ul className="flex flex-col flex-grow bg-gray-200">
          {localTasks.map((todo) => {
            // Jika dalam proses optimisitic UI tugas ini jadi false, jangan dirender
            if (!todo.is_done) return null;

            return (
              <li 
                key={todo.unique_id}
                className={`flex flex-col px-6 py-5 ${
                  todo.unique_id !== localTasks.length - 1 ? 'border-b-2 border-white' : ''
                }`}
              >
                <div className="flex items-start gap-4 w-full">
                  
                  {/* CHECKBOX (BISA DI-UNCHECK) */}
                  <button 
                    onClick={() => onToggle(todo.id, todo.is_done)}
                    className="w-6 h-6 rounded flex-shrink-0 mt-1 border-2 bg-[#133F25] border-[#133F25] flex items-center justify-center transition-colors hover:bg-gray-400 hover:border-gray-500"
                    title="Batalkan Selesai"
                  >
                    <FiCheck className="text-white text-lg font-bold" />
                  </button>
                  
                  {/* KONTEN TEKS (Dibikin redup/transparan) */}
                  <div className="flex flex-col w-full opacity-60">
                    
                    {/* Judul Teks */}
                    <span className="text-xl font-bold text-[#133F25]">
                      {todo.judul_tugas} 
                    </span>

                    {/* Deskripsi */}
                    {todo.deskripsi && (
                      <p className="text-sm mt-2 leading-relaxed text-gray-700 font-medium">
                        {todo.deskripsi}
                      </p>
                    )}

                    {/* TANGGAL */}
                    {/* --- KONDISI 1: JIKA INI ADALAH TUGAS (TODO) --- */}
                    {todo.tipe_item === 'todo' && todo.tanggal_mulai && todo.tanggal_selesai && (
                      <div className={`flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black mt-4 uppercase tracking-wide ${
                         todo.is_done ? 'opacity-50' : ''
                      }`}>
                        <span className="text-[#133F25]">
                          Start: {todo.tanggal_mulai.split('T')[0]}
                        </span>
                        <span className="text-[#EB0000]">
                          Deadline: {todo.tanggal_selesai.split('T')[0]}
                        </span>
                      </div>
                    )}

                    {/* --- KONDISI 2: JIKA INI ADALAH KEGIATAN (RAPAT/DLL) --- */}
                    {todo.tipe_item === 'kegiatan' && (
                      <div className={`flex flex-col gap-3 mt-4 ${todo.is_done ? 'opacity-50' : ''}`}>
                        
                        {/* Tanggal Kegiatan */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black uppercase tracking-wide">
                          <span className="text-[#133F25]">
                            Tgl: {todo.tanggal_mulai ? todo.tanggal_mulai.split('T')[0] : '-'}
                          </span>
                          {/* Jika kegiatan ada tanggal selesainya juga, kita tampilkan */}
                          {todo.tanggal_selesai && todo.tanggal_selesai !== todo.tanggal_mulai && (
                            <span className="text-[#EB0000]">
                              Sampai: {todo.tanggal_selesai.split('T')[0]}
                            </span>
                          )}
                        </div>

                        {/* Jam dan Lokasi (Pakai Icon) */}
                        <div className="flex flex-wrap gap-6 text-sm font-semibold text-[#133F25]">
                          {todo.waktu && (
                            <div className="flex items-center gap-1.5">
                              <FiClock className="text-lg" /> 
                              {todo.waktu}
                            </div>
                          )}
                          {todo.lokasi && (
                            <div className="flex items-center gap-1.5">
                              <FiMapPin className="text-lg" /> 
                              {todo.lokasi}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                    
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default FinishedTodo;