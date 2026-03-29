import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiClock, FiMapPin, FiAlertCircle, FiCheck } from 'react-icons/fi';
import PlusIcon  from './Icons/PlusIcon';
import AddTodoPopUp from './AddTodoPopUp';
import SuccessPopUp from './SuccessPopUp';
import useAuthStore from '../Store/useAuthStore';

// Tambahkan onRefresh di props
function Todo({ tasks = [], onToggle }) { 
  const location = useLocation();
  const isDetailedView = location.pathname.includes('/todo');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const role = useAuthStore((state) => state.role);

  // STATE LOKAL UNTUK OPTIMISTIC UI
  const [localTasks, setLocalTasks] = useState([]);
  console.log(role)
  // Sinkronkan data dari parent (Dashboard) ke state lokal
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  function handleShowTodo() {
    setShowAddTodo(true)
  }

  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* KOTAK NOTE: HANYA MUNCUL DI HALAMAN DETAIL */}
      {isDetailedView && (
        <div className="bg-white border-2 border-[#014421] rounded-2xl px-6 py-4 shadow-sm">
          <h3 className="font-bold text-lg text-[#014421] mb-2 uppercase">NOTE :</h3>
          <ul className="list-none space-y-1.5 text-sm text-gray-600 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#133F25] mt-0.5">○</span>
              Untuk Menyelesaikan Tugas Harap Konfirmasi Kepada Koordinator Divisi Masing Masing
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#133F25] mt-0.5">○</span>
              Bla bla blablal bla I blal blalblalbl fllblb blal bla blal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#133F25] mt-0.5">○</span>
              Na nONO oO dnON O DONo ndOSMDO doN DOn o
            </li>
          </ul>
        </div>
      )}

      {/* KONTAINER UTAMA TO-DO */}
      <div className="h-full flex flex-col bg-white border-2 border-gray-200 shadow-sm overflow-hidden rounded-xl">
        
        {/* HEADER HIJAU GELAP */}
        <div className="bg-[#133F25] py-4 md:py-4 flex items-center justify-center p-2 relative flex-shrink-0">
          <h2 className="text-2xl md:text-4xl text-center w-full font-bold text-[#E6e6e6] z-10">
            TO-DO 
          </h2>
          {(role === 'PRESIDIUM' || role === 'INTI') && isDetailedView && (
            <button 
              onClick={handleShowTodo} 
              className="absolute right-3 md:right-6 z-20 active:scale-95 flex justify-center gap-1 md:gap-2 items-center bg-[#397F22] text-[#e6e6e6] hover:bg-[#397F22]/80 font-bold py-1.5 px-3 md:py-2 md:min-w-[120px] md:px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-xs md:text-base"
            >
              <div className="w-3 md:w-4 flex items-center justify-center">
                <PlusIcon />
              </div>
              Add
            </button>
          )}
        </div>

        {/* DAFTAR TUGAS */}
        <ul className="flex flex-col flex-grow">
          {/* MENGGUNAKAN localTasks BUKAN tasks */}
          {localTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic font-bold">
              Belum ada tugas untuk divisi ini.
            </div>
          ) : (
            localTasks.map((todo) => (
              <li 
                key={todo.unique_id} 
                className={`flex flex-col px-6 py-5 hover:bg-gray-50 transition-colors ${
                  todo.unique_id !== localTasks.length - 1 ? 'border-b-2 border-[#133F25]' : ''
                }`}
              >
                <div className="flex items-start gap-4 w-full">
                  
                  {/* CHECKBOX CUSTOM */}
                  <button 
                    onClick={() => onToggle(todo.id, todo.is_done)}
                    className={`w-6 h-6 rounded flex-shrink-0 mt-1 border-2 flex items-center justify-center transition-colors ${
                      todo.is_done 
                        ? 'bg-[#133F25] border-[#133F25]' 
                        : 'border-[#133F25] hover:bg-gray-200'
                    }`}
                  >
                    <FiCheck className="text-white text-lg font-bold" />
                  </button>
                  
                  {/* KONTEN TEKS */}
                  <div className="flex flex-col w-full">
                    
                    {/* Judul langsung tembak 'tugas' dari API */}
                    <span className={`text-xl font-bold transition-all ${
                      todo.is_done ? 'text-gray-400 line-through' : 'text-[#133F25]'
                    }`}>
                      {todo.tugas} 
                    </span>

                    {/* Deskripsi */}
                    {todo.deskripsi && (
                      <p className={`text-sm mt-2 leading-relaxed ${
                        todo.is_done ? 'text-gray-300' : 'text-gray-600 font-medium'
                      }`}>
                        {todo.deskripsi}
                      </p>
                    )}

                    {/* TANGGAL: Langsung tembak start_date dan deadline dari API */}
                    {todo.start_date && todo.deadline && (
                      <div className={`flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black mt-4 uppercase tracking-wide ${
                         todo.is_done ? 'opacity-50' : ''
                      }`}>
                        <span className="text-[#133F25]">
                          Start: {todo.start_date.split('T')[0]}
                        </span>
                        <span className="text-[#EB0000]">
                          Deadline: {todo.deadline.split('T')[0]}
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
            ))
          )}
        </ul>
      </div>

      <AddTodoPopUp 
        isOpen={showAddTodo} 
        onClose={() => setShowAddTodo(false)} 
        onSuccess={() => {
          setShowAddTodo(false);     // Tutup pop up form
          setIsSuccessOpen(true);   // Buka pop-up sukses
        }}
      />

      <SuccessPopUp
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message="To-Do Berhasil Ditambahkan!"
      />
    </div>
  );
}

export default Todo;