// src/pages/DashboardUmum.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import Todo from '../../components/Todo';

function Dashboard() {
  // 1. Buat state viewMode di sini
  const [viewMode, setViewMode] = useState('global');
  const dummyDashboardTodos = [
    {
      title: "Buat WEB dengan standar operasional",
      type: "deadline",
      startDate: "24/3/2026",
      endDate: "31/3/2026",
      alert: "Sisa 1 Hari Lagi"
    },
    {
      title: "Rapat Divisi RnB 1",
      type: "event",
      time: "19.00 WIB",
      location: "Kupi Batigo"
    },
    { title: "Buat WEB dengan standar operasional", type: "simple" },
    { title: "Buat WEB dengan standar operasional", type: "simple" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F4] flex pl-24 transition-all duration-300">
      <Sidebar />

      <main className="flex-grow p-5 space-y-4">
        {/* HEADER DASHBOARD */}
        <header className="flex items-center p-2 relative">
          <h1 className="text-4xl text-center w-full font-bold font-serif text-[#004D25]">DASHBOARD</h1>
          
          <div className="flex items-center gap-3 text-right absolute right-2">
            <div>
                <p className="font-bold text-[#004D25]">Nay Rangers</p>
                <p className="text-sm text-green-900/70">KOOR MIT</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-cyan-300/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-600">N</span>
            </div>
          </div>
        </header>

        

        {/* 3. GRID KALENDER & TO-DO */}
        {/* Pastikan menggunakan flex-col di mobile agar bertumpuk rapi */}
        <div className='flex flex-col lg:grid lg:grid-cols-2 px-2 gap-4'>
            
            {/* Lempar viewMode sebagai props ke Calendar */}
            <div className='bg-white px-4 pb-2'>
                {/* 2. TOMBOL SWITCH GLOBAL / DIVISI */}
                <div className="flex justify-end px-2 pt-2 my-2">
                  <div className="flex border-2 border-[#133F25] font-extrabold text-sm rounded-sm overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setViewMode('global')}
                      className={`px-6 py-1.5 transition-colors ${
                        viewMode === 'global' 
                          ? 'bg-[#133F25] text-white' 
                          : 'bg-white text-[#133F25] hover:bg-gray-100'
                      }`}
                    >
                      Global
                    </button>
                    <button 
                      onClick={() => setViewMode('divisi')}
                      className={`px-6 py-1.5 transition-colors ${
                        viewMode === 'divisi' 
                          ? 'bg-[#133F25] text-white' 
                          : 'bg-white text-[#133F25] hover:bg-gray-100'
                      }`}
                    >
                      Divisi
                    </button>
                  </div>
                </div>
                <Calendar viewMode={viewMode} />
              </div>
            
            {/* Nantinya Todo juga bisa menerima viewMode untuk logika filternya */}
            <Todo viewMode={viewMode} tasks={dummyDashboardTodos} />
            
        </div>
      </main>
    </div>
  );
}

export default Dashboard;