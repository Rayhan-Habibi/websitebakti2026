import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

function FinishedTodo({ tasks = [], onToggle }) {
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  if (tasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-6 font-sans h-full">
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
            if (!todo.is_done) return null;
            return (
              <TodoItem 
                key={todo.unique_id || todo.id} 
                todo={todo} 
                onToggle={onToggle} 
                variant="finished" 
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default FinishedTodo;