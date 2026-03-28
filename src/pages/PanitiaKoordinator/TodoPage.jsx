import React, {useEffect, useCallback, useState} from 'react';
import Todo from '../../components/Todo';
import MissedOut from '../../components/MissedOut';
import FinishedTodo from '../../components/FinishedTodo'; 
import useAuthStore from '../../Store/useAuthStore';
import axios from 'axios';
import RefreshIcon from '../../components/RefreshIcon';

export default function TodoPage() {
  const userData = useAuthStore((state) => state.user);
  const divisiId = userData?.divisi_id;
  const token = useAuthStore((state) => state.token);
  
  const [todos, setTodos] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!divisiId) return;
    setIsRefreshing(true); 

    try {
      // 🔥 PERBAIKAN: Langsung tembak axios biasa, buang Promise.all
      const responseTodo = await axios.get(`https://api.baktiunand2026.com/api/todos/${divisiId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sekarang responseTodo udah murni objek dari Axios
      console.log("Data diterima:", responseTodo.data.data);
      setTodos(responseTodo.data.data || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setIsRefreshing(false); 
    }
  }, [divisiId, token])

  useEffect(() => {
    document.title = "To-Do List Panitia";
    fetchDashboardData(); 
  }, [fetchDashboardData]); 

  const handleToggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const backupTodos = [...todos];

    setTodos(todos.map(task => 
      task.id === id ? { ...task, is_done: newStatus } : task
    ));

    try {
      await axios.patch(`https://api.baktiunand2026.com/api/todos/${id}/status`, 
        { is_done: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setTodos(backupTodos);
      alert("Gagal memindahkan tugas. Cek koneksi internetmu.");
    }
  };

  // --- 1. DATA NORMALIZATION (Menyeragamkan Format) ---
  // Kita satukan 'todos' dan 'kegiatan' jadi satu array raksasa yang seragam
  const normalizedData = [
    // Format dari array Todos
    ...todos.map(item => ({
      ...item, // Bawa semua data aslinya
      tipe_item: 'todo', // Penanda biar kita tahu ini asalnya darimana
      judul_tugas: item.tugas, 
      unique_id: `todo-${item.id}`,
      tanggal_mulai: item.start_date,
      tanggal_selesai: item.deadline,
    })),
    // Format dari array Kegiatan
    ...kegiatan.map(item => ({
      ...item,
      tipe_item: 'kegiatan',
      // Kalau backend kegiatan pakai 'nama_acara', kita paksa jadi 'judul_tugas'
      judul_tugas: item.title || item.tugas || 'Tanpa Judul', 
      unique_id: `kegiatan-${item.id}`,
      // Sesuaikan key tanggal dari API Kegiatan (misal: 'tanggal' dan 'tanggal_berakhir')
      tanggal_mulai: item.date || item.start_date, 
      tanggal_selesai: item.tanggal_berakhir || item.deadline || item.tanggal, 
      // Tambahkan is_done manual jika backend Kegiatan tidak punya fitur centang
      is_done: item.is_done || false, 
    }))
  ];


  // --- 2. LOGIKA PEMISAHAN DATA ---
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); 

  const activeTodos = [];
  const missedTodos = [];
  const finishedTodos = []; 

  // Sekarang kita ngeloop dari data yang sudah diseragamkan
  normalizedData.forEach(task => {
    
    // 1. Cek Finished
    if (task.is_done === true || task.is_done === 1) {
      finishedTodos.push(task);
      return; 
    }
    
    // 2. Kalau tidak punya tanggal selesai, masuk Active
    if (!task.tanggal_selesai) {
      activeTodos.push(task);
      return;
    }

    // 3. Hitung Selisih Hari pakai key yang sudah dinormalisasi
    const taskEndDate = new Date(task.tanggal_selesai);
    taskEndDate.setHours(0, 0, 0, 0); 

    const diffTime = taskEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      task.alert = "Tenggat Terlewati";
      // Misal: Kegiatan Rapat kalau udah lewat tanggalnya, anggap aja Finished
      if (task.tipe_item === 'kegiatan') {
         finishedTodos.push(task);
      } else {
         missedTodos.push(task);
      }
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
        <RefreshIcon fetchDashboardData={fetchDashboardData} isRefreshing={isRefreshing} />
      </div>
      
      <div className="flex flex-col gap-10">
        
        <Todo 
          tasks={activeTodos} 
          onRefresh={fetchDashboardData} 
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