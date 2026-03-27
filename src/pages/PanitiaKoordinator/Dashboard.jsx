// src/pages/DashboardUmum.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import Todo from '../../components/Todo';
import IndikatorDivisi from '../../components/IndikatorDivisi';

function Dashboard() {
  const [viewMode, setViewMode] = useState('global');
  const dummyDashboardTodos = [
    { title: "Buat WEB dengan standar operasional", type: "deadline", startDate: "24/3/2026", endDate: "31/3/2026", alert: "Sisa 1 Hari Lagi" },
    { title: "Rapat Divisi RnB 1", type: "event", time: "19.00 WIB", location: "Kupi Batigo" },
    { title: "Buat WEB dengan standar operasional", type: "simple" },
    { title: "Buat WEB dengan standar operasional", type: "simple" },
  ];

  return (
    // PERBAIKAN: max-h-[80%] dan flex DHAPUS total. Biarkan dia tumbuh natural.
    <div className="min-h-screen pt-20 md:pt-0 bg-[#F1F3F4] lg:pl-24 transition-all duration-300 w-full overflow-x-hidden">
      
      {/* PERBAIKAN: flex-grow DHAPUS karena parent-nya sudah bukan flex */}
      <main className="p-3 md:p-5 space-y-4 w-full relative"> 
        
        {/* HEADER DASHBOARD */}
        <header className="flex items-center justify-center p-2 relative w-full h-20 mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl text-center w-full font-bold text-[#004D25] z-10">DASHBOARD</h1>
          <div className="absolute right-2 md:right-6 top-1 md:top-2 z-20 w-fit transform scale-90 md:scale-100 flex-shrink-0">
            <IndikatorDivisi namaDivisi="MIT" warna="#67E8F9" />
          </div>
        </header>

        {/* 3. GRID KALENDER & TO-DO */}
        <div className='flex flex-col lg:grid lg:grid-cols-2 px-0 md:px-2 gap-6 md:gap-4 w-full'>
            
            {/* Kalender Section */}
            <div className='bg-white rounded-md px-4 pb-2 w-full min-w-0'>
                <div className="flex justify-center md:justify-end px-2 pt-4 md:pt-2 my-2">
                  <div className="flex border-2 border-[#133F25] font-extrabold text-sm rounded-sm overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setViewMode('global')}
                      className={`px-6 py-1.5 transition-colors ${ viewMode === 'global' ? 'bg-[#133F25] text-white' : 'bg-white text-[#133F25] hover:bg-gray-100' }`}
                    >
                      Global
                    </button>
                    <button 
                      onClick={() => setViewMode('divisi')}
                      className={`px-6 py-1.5 transition-colors ${ viewMode === 'divisi' ? 'bg-[#133F25] text-white' : 'bg-white text-[#133F25] hover:bg-gray-100' }`}
                    >
                      Divisi
                    </button>
                  </div>
                </div>
                
                {/* WADAH KALENDER */}
                <div className="w-full pb-2">
                   <Calendar viewMode={viewMode} />
                </div>
            </div>
            
            {/* Todo Section */}
            <div className="w-full min-w-0">
               <Todo viewMode={viewMode} tasks={dummyDashboardTodos} />
            </div>
            
        </div>
      </main>
    </div>
  );
}

export default Dashboard;