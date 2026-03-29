import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlusIcon from '../ui/Icons/PlusIcon';
import AddTodoPopUp from './AddTodoPopUp';
import SuccessPopUp from '../ui/SuccessPopUp';
import useAuthStore from '../../Store/useAuthStore';
import TodoItem from './TodoItem';

function Todo({ tasks = [], onToggle }) { 
  const location = useLocation();
  const isDetailedView = location.pathname.includes('/todo');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const role = useAuthStore((state) => state.role);

  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

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
              onClick={() => setShowAddTodo(true)} 
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
          {localTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic font-bold">
              Belum ada tugas untuk divisi ini.
            </div>
          ) : (
            localTasks.map((todo) => (
              <TodoItem 
                key={todo.unique_id || todo.id} 
                todo={todo} 
                onToggle={onToggle} 
                variant="active" 
              />
            ))
          )}
        </ul>
      </div>

      <AddTodoPopUp 
        isOpen={showAddTodo} 
        onClose={() => setShowAddTodo(false)} 
        onSuccess={() => {
          setShowAddTodo(false);
          setIsSuccessOpen(true);
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