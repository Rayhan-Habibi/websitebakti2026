import React from 'react';
import TodoItem from './TodoItem';

function MissedOut({ tasks = [], onToggle }) {
  if (tasks.length === 0) return null;

  return (
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
          <TodoItem 
            key={item.unique_id || item.id} 
            todo={item} 
            onToggle={onToggle} 
            variant="missed" 
          />
        ))}
      </ul>
      
    </div>
  );
}

export default MissedOut;