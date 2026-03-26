import React from 'react';
import Todo from '../../components/Todo';
import MissedOut from '../../components/MissedOut';

export default function TodoPage() {
  // 1. DATA MENTAH DARI API (Simulasi)
  const allTasks = [
    {
      title: "Rapat Divisi RnB 1",
      desc: "Rapat perdana divisi RnB",
      type: "event",
      endDate: "28/3/2026", // Masih nanti
    },
    {
      title: "Buat WEB dengan standar operasional",
      desc: "Tugas website utama...",
      type: "deadline",
      startDate: "22/3/2026",
      endDate: "24/3/2026", // SUDAH LEWAT (Missed Out)
    },
    {
      title: "Desain ID Card Panitia",
      type: "deadline",
      startDate: "25/3/2026",
      endDate: "28/3/2026", // HAMPIR DEADLINE (Sisa 2 Hari)
    }
  ];

  //Cek role saat ini
 
  // 2. LOGIKA PEMISAHAN DATA (Frontend Logic Sementara)
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); // Reset jam biar akurat cuma ngecek tanggal

  // Fungsi bantu untuk ubah string "24/3/2026" jadi objek Date JavaScript
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  const activeTodos = [];
  const missedTodos = [];

  allTasks.forEach(task => {
    const taskEndDate = parseDate(task.endDate);
    
    // Kalau tidak punya endDate, anggap active
    if (!taskEndDate) {
      activeTodos.push(task);
      return;
    }

    // Hitung selisih hari
    const diffTime = taskEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // JIKA MINUS: Tenggat sudah lewat
      task.alert = "Tenggat Terlewati";
      missedTodos.push(task);
    } else {
      // JIKA POSITIF: Masih aktif
      // Logika frontend sementara untuk alert (muncul kalau <= 3 hari)
      if (diffDays <= 3 && task.type === 'deadline') {
        task.alert = `Sisa ${diffDays} Hari Lagi`;
      }
      activeTodos.push(task);
    }
  });

  return (
    // Layout Utama Halaman Todo
    <div className="min-h-screen bg-[#F1F3F4] pl-24 p-10 flex flex-col gap-8">
      <h1 className="text-4xl text-center font-bold font-serif text-[#004D25]">TO-DO List</h1>
      
      {/* 3. LEMPAR DATA YANG SUDAH DIFILTER SEBAGAI PROPS */}
      <div className="flex flex-col gap-10">
        <Todo tasks={activeTodos} />
        
        {/* Render MissedOut HANYA JIKA ada data yang terlewat */}
        {missedTodos.length > 0 && (
           <MissedOut tasks={missedTodos} />
        )}
      </div>
    </div>
  );
}