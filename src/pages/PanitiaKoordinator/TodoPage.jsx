import React, { useEffect, useCallback, useState } from 'react';
import Todo from '../../components/todo/Todo';
import MissedOut from '../../components/todo/MissedOut';
import FinishedTodo from '../../components/todo/FinishedTodo'; 
import useAuthStore from '../../Store/useAuthStore';
import api from '../../config/api';
import RefreshIcon from '../../components/ui/RefreshIcon';

export default function TodoPage() {
  const userData = useAuthStore((state) => state.user);
  const divisiId = userData?.divisi_id;
  const token = useAuthStore((state) => state.token);
  
  const [todos, setTodos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FIX: Renamed from fetchDashboardData → fetchTodoData
  const fetchTodoData = useCallback(async () => {
    if (!divisiId) return;
    setIsRefreshing(true); 

    try {
      const responseTodo = await api.get(`/api/todos/${divisiId}`);
      setTodos(responseTodo.data.data || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setIsRefreshing(false); 
    }
  }, [divisiId, token]);

  useEffect(() => {
    document.title = "To-Do List | Bakti Unand 2026";
    fetchTodoData(); 
  }, [fetchTodoData]); 

  const handleToggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const backupTodos = [...todos];

    setTodos(todos.map(task => 
      task.id === id ? { ...task, is_done: newStatus } : task
    ));

    try {
      await api.patch(`/api/todos/${id}/status`, { is_done: newStatus });
    } catch (error) {
      setTodos(backupTodos);
      alert("Gagal memindahkan tugas. Cek koneksi internetmu.");
    }
  };

  // --- DATA NORMALIZATION ---
  const normalizedData = [
    ...todos.map(item => ({
      ...item,
      tipe_item: 'todo',
      judul_tugas: item.tugas, 
      unique_id: `todo-${item.id}`,
      tanggal_mulai: item.start_date,
      tanggal_selesai: item.deadline,
    })),
  ];

  // --- LOGIKA PEMISAHAN DATA ---
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); 

  const activeTodos = [];
  const missedTodos = [];
  const finishedTodos = []; 

  normalizedData.forEach(task => {
    if (task.is_done === true || task.is_done === 1) {
      finishedTodos.push(task);
      return; 
    }
    
    if (!task.tanggal_selesai) {
      activeTodos.push(task);
      return;
    }

    const taskEndDate = new Date(task.tanggal_selesai);
    taskEndDate.setHours(0, 0, 0, 0); 

    const diffTime = taskEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      task.alert = "Tenggat Terlewati";
      missedTodos.push(task);
    } else {
      if (diffDays <= 3) {
        task.alert = `Sisa ${diffDays} Hari Lagi`;
      }
      activeTodos.push(task);
    }
  });

  return (
    <div className="min-h-screen bg-[#F1F3F4] p-4 pt-24 md:p-10 md:pt-10 lg:pl-28 flex flex-col gap-6 md:gap-8 w-full overflow-x-hidden">
      <h1 className="text-3xl md:text-4xl text-center font-extrabold text-[#014421]">To-Do List</h1>
      
      <div className="z-20 pointer-events-auto">
        <RefreshIcon fetchDashboardData={fetchTodoData} isRefreshing={isRefreshing} />
      </div>
      
      <div className="flex flex-col gap-10">
        
        <Todo 
          tasks={activeTodos} 
          onRefresh={fetchTodoData} 
          onToggle={handleToggleTask} 
        />
        
        {missedTodos.length > 0 && (
           <MissedOut tasks={missedTodos} onToggle={handleToggleTask} />
        )}

        {finishedTodos.length > 0 && (
           <FinishedTodo 
             tasks={finishedTodos} 
             onToggle={handleToggleTask} 
           />
        )} 

      </div>
    </div>
  );
}