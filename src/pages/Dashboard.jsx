// src/pages/DashboardUmum.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import Todo from '../components/Todo';
// Import komponen kalender/todo kamu

function Dashboard() {
  return (
    // MAIN LAYOUT: Berikan padding-left minimal 96px (pl-24) agar konten tidak tertutup sidebar
    <div className="min-h-screen bg-[#F1F3F4] flex pl-24 transition-all duration-300">
      
      {/* 1. SIDEBAR MENEMPEL DI KIRI */}
      <Sidebar />

      {/* 2. KONTEN UTAMA DASHBOARD */}
      <main className="flex-grow p-10 space-y-8">
        {/* Bagian Header Dashboard (logo user, judul) */}
        <header className="flex items-center bg-white p-6 shadow-sm border border-green-800/10">
          <h1 className="text-4xl text-center w-full font-bold font-serif text-[#004D25]">DASHBOARD</h1>
          {/* Bagian User/Koor MIT */}
          <div className="flex items-center gap-3 text-right">
            <div>
                <p className="font-bold text-[#004D25]">Nay Rangers</p>
                <p className="text-sm text-green-900/70">KOOR MIT</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-cyan-300/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-600">N</span>
            </div>
          </div>
        </header>

        {/* Bagian Kalender, To-Do dll... */}
        <div className="bg-white p-8 shadow-sm border border-green-800/10">
          {/* Panggil komponen Kalender custom mu di sini */}
          <Calendar/>
          {/* ... render kalender ... */}
        </div>
        
        {/* Bagian To-Do */}
       <Todo/>

      </main>
    </div>
  );
}

export default Dashboard;