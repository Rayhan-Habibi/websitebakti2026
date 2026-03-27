import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import PlusIcon  from './Icons/PlusIcon';
import AddTodoPopUp from './AddTodoPopUp';
import SuccessPopUp from './SuccessPopUp';

function Todo({ tasks = [] }) { 
  // 1. CEK LOKASI URL SAAT INI
  const location = useLocation();
  const isDetailedView = location.pathname.includes('/todo');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);

  function handleShowTodo() {
    setShowAddTodo(true)
  }

  const [currentRole, setCurrentRole] = useState('koordinator'); 

  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
      
      {/* 3. KOTAK NOTE: HANYA MUNCUL DI HALAMAN DETAIL */}
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

      {/* 4. KONTAINER UTAMA TO-DO */}
      <div className="h-full flex flex-col bg-white border-2 border-gray-200 shadow-sm overflow-hidden rounded-xl">
        
        {/* HEADER HIJAU GELAP */}
        {/* PERBAIKAN: justify-center agar tulisan rapi, padding disesuaikan */}
        <div className="bg-[#133F25] py-4 md:py-4 flex items-center justify-center p-2 relative flex-shrink-0">
          
          {/* PERBAIKAN: text-2xl di mobile, text-4xl di desktop. Tambah z-10 */}
          <h2 className="text-2xl md:text-4xl text-center w-full font-bold text-[#E6e6e6] z-10">
            TO-DO 
          </h2>
          
          {currentRole === 'koordinator' && isDetailedView && (
            /* PERBAIKAN: Padding kecil di HP (px-3 py-1.5), min-w-[120px] HANYA untuk desktop (md:). mx-4 dihapus agar tidak nabrak ke tengah */
            <button 
              onClick={handleShowTodo} 
              className="absolute right-3 md:right-6 z-20 active:scale-95 flex justify-center gap-1 md:gap-2 items-center bg-[#397F22] text-[#e6e6e6] hover:bg-[#397F22]/80 font-bold py-1.5 px-3 md:py-2 md:min-w-[120px] md:px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-xs md:text-base"
            >
              {/* Bungkus icon agar proporsional mengecil di HP */}
              <div className="w-3 md:w-4 flex items-center justify-center">
                <PlusIcon />
              </div>
              Add
            </button>
          )}
        </div>

        {/* DAFTAR TUGAS */}
        <ul className="flex flex-col flex-grow">
          {tasks.map((todo, index) => (
            <li 
              key={index} 
              className={`flex flex-col px-6 py-5 ${
                index !== tasks.length - 1 ? 'border-b-2 border-[#133F25]' : ''
              }`}
            >
              <div className="flex justify-between w-full">
                
                <div className="flex items-start gap-4 lg:w-3/4 w-2/3">
                  <div className="w-4 h-4 rounded-full bg-[#133F25] flex-shrink-0 mt-1.5"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[#133F25]">
                      {todo.title}
                    </span>

                    {isDetailedView && todo.desc && (
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        {todo.desc}
                      </p>
                    )}

                    {!isDetailedView && todo.type === 'deadline' && (
                      <div className="flex flex-wrap gap-4 text-[13px] font-black mt-1 uppercase tracking-wide">
                        <span className="text-[#133F25]">Start Date : {todo.startDate}</span>
                        <span className="text-red-600">End Date : {todo.endDate}</span>
                      </div>
                    )}
                    
                    {!isDetailedView && todo.type === 'event' && (
                      <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#133F25] mt-1">
                        <div className="flex items-center gap-1.5"><FiClock /> {todo.time}</div>
                        <div className="flex items-center gap-1.5"><FiMapPin /> {todo.location}</div>
                      </div>
                    )}
                  </div>
                </div>

                {todo.alert && (
                  <div className="flex items-start justify-end gap-2 text-red-600 font-bold text-sm lg:text-base whitespace-nowrap lg:w-1/4 w-1/3 mt-0.5">
                    <FiAlertCircle className="text-xl lg:text-2xl stroke-[2.5]" />
                    <span className="hidden md:inline">{todo.alert}</span>
                  </div>
                )}
              </div>

              {isDetailedView && todo.type === 'deadline' && (
                <div className="flex flex-wrap justify-end gap-6 text-[14px] font-black mt-6 uppercase tracking-wide w-full pr-2">
                  <span className="text-[#133F25]">Start Date : {todo.startDate}</span>
                  <span className="text-red-600">End Date : {todo.endDate}</span>
                </div>
              )}
              
            </li>
          ))}
        </ul>
      </div>

      <AddTodoPopUp 
        isOpen={showAddTodo} 
        onClose={() => setShowAddTodo(false)} 
        onSuccess={() => {
          setShowAddTodo(true);      // 1. Tetap buka formulir
          setIsSuccessOpen(true);   // 2. Buka pop-up sukses
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