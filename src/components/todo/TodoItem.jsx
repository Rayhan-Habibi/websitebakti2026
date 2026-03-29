import React from 'react';
import { FiClock, FiMapPin, FiAlertCircle, FiCheck } from 'react-icons/fi';

/**
 * Komponen reusable untuk menampilkan satu item tugas.
 * Dipakai oleh: Todo, FinishedTodo, MissedOut
 * 
 * Props:
 * - todo: object data tugas
 * - onToggle: function(id, is_done) untuk toggle status
 * - variant: 'active' | 'finished' | 'missed' — mengubah styling
 */
function TodoItem({ todo, onToggle, variant = 'active', hideCheckbox = false }) {
  const isFinished = variant === 'finished';
  const isMissed = variant === 'missed';

  const borderClass = isMissed
    ? 'border-b-2 border-[#133F25]'
    : isFinished
    ? 'border-b-2 border-white'
    : 'border-b-2 border-[#133F25]';

  const hoverClass = isMissed
    ? 'hover:bg-red-50'
    : isFinished
    ? ''
    : 'hover:bg-gray-50';

  return (
    <li className={`flex flex-col px-6 py-5 ${borderClass} ${hoverClass} transition-colors`}>
      <div className="flex items-start gap-4 w-full">
        
        {/* CHECKBOX */}
        {!hideCheckbox && (
          <button 
            onClick={() => onToggle && onToggle(todo.id, todo.is_done)}
            className={`w-6 h-6 rounded flex-shrink-0 mt-1 border-2 flex items-center justify-center transition-colors ${
              todo.is_done 
                ? 'bg-[#133F25] border-[#133F25]' + (isFinished ? ' hover:bg-gray-400 hover:border-gray-500' : '')
                : 'border-[#133F25] hover:bg-gray-200'
            }`}
            title={isFinished ? 'Batalkan Selesai' : 'Selesaikan Tugas'}
          >
            {todo.is_done && <FiCheck className="text-white text-lg font-bold" />}
          </button>
        )}
        
        {/* KONTEN TEKS */}
        <div className={`flex flex-col w-full ${isFinished ? 'opacity-60' : ''}`}>
          
          {/* Judul */}
          <div className="flex justify-between w-full">
            <span className={`text-xl font-bold transition-all ${
              todo.is_done && !isFinished ? 'text-gray-400 line-through' : 'text-[#133F25]'
            }`}>
              {todo.judul_tugas || todo.tugas}
            </span>

            {/* Alert (untuk missed/active with deadline dekat) */}
            {isMissed && todo.alert && (
              <div className="flex items-start gap-2 text-red-600 font-bold text-sm lg:text-base whitespace-nowrap ml-4">
                <FiAlertCircle className="text-xl lg:text-2xl stroke-[2.5]" />
                <span className="hidden md:inline">{todo.alert}</span>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          {todo.deskripsi && (
            <p className={`text-sm mt-2 leading-relaxed ${
              todo.is_done ? 'text-gray-300' : 'text-gray-600 font-medium'
            }`}>
              {todo.deskripsi}
            </p>
          )}

          {/* TANGGAL: Untuk Tugas (Todo) */}
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

          {/* Fallback: Todo tanpa tipe_item tapi punya start_date & deadline */}
          {!todo.tipe_item && todo.start_date && todo.deadline && (
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

          {/* TANGGAL & DETAIL: Untuk Kegiatan (Rapat dll) */}
          {todo.tipe_item === 'kegiatan' && (
            <div className={`flex flex-col gap-3 mt-4 ${todo.is_done ? 'opacity-50' : ''}`}>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black uppercase tracking-wide">
                <span className="text-[#133F25]">
                  Tgl: {todo.tanggal_mulai ? todo.tanggal_mulai.split('T')[0] : '-'}
                </span>
                {todo.tanggal_selesai && todo.tanggal_selesai !== todo.tanggal_mulai && (
                  <span className="text-[#EB0000]">
                    Sampai: {todo.tanggal_selesai.split('T')[0]}
                  </span>
                )}
              </div>
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
}

export default TodoItem;
