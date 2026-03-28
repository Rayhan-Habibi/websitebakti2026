import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Calendar from '../../components/Calendar';
import Todo from '../../components/Todo';
import IndikatorDivisi from '../../components/IndikatorDivisi';
import useAuthStore from '../../Store/useAuthStore';
import axios from 'axios';
import RefreshIcon from '../../components/RefreshIcon';

function Dashboard() {
  const [viewMode, setViewMode] = useState('global');
  const userData = useAuthStore((state) => state.user);
  const divisiId = userData?.divisi_id;
  const divisi = userData?.divisi?.nama_divisi || 'Memuat...';
  const token = useAuthStore((state) => state.token);
  
  const [todos, setTodos] = useState([]);
  const [kalender, setKalender] = useState([]);
  
  // 2. STATE UNTUK ANIMASI LOADING REFRESH
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 3. KELUARKAN FUNGSI FETCH AGAR BISA DIPANGGIL TOMBOL
  // Kita pakai useCallback agar React tidak ngomel saat ditaruh di dalam useEffect
  const fetchDashboardData = useCallback(async () => {
    if (!divisiId) return;

    setIsRefreshing(true); // Mulai animasi muter

    try {
      const [responseTodo, responseKalender] = await Promise.all([
        axios.get(`https://api.baktiunand2026.com/api/todos/${divisiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://api.baktiunand2026.com/api/kegiatan/kalender`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      console.log("Data diterima")

      setTodos(responseTodo.data.data);
      setKalender(responseKalender.data.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Gagal memuat data Dashboard. Silakan coba lagi.");
    } finally {
      // Entah sukses atau error, animasi muter harus dimatikan
      setIsRefreshing(false); 
    }
  }, [divisiId, token]); // Fungsi ini akan diperbarui kalau divisiId atau token berubah

  useEffect(() => {
    document.title = "Dashboard Panitia";
    fetchDashboardData(); // Panggil saat pertama kali halaman dibuka
  }, [fetchDashboardData]); 

  return (
    <div className="min-h-screen pt-20 md:pt-0 bg-[#F1F3F4] lg:pl-24 transition-all duration-300 w-full overflow-x-hidden">
      <main className="p-3 md:p-5 space-y-4 w-full relative"> 
        
        {/* HEADER DASHBOARD */}
        {/* Di HP: flex-col (menumpuk). Di PC: flex-row (sejajar) & tinggi tetap h-20 */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-center p-2 relative w-full mb-4 md:mb-0 md:h-20 gap-4 md:gap-0">
          
          {/* JUDUL TENGAH */}
          {/* Di HP: Muncul pertama (atas). Di PC: Di tengah */}
          <h1 className="text-3xl md:text-4xl text-center w-full font-bold text-[#004D25] z-10">
            DASHBOARD
          </h1>

          {/* WADAH TOMBOL & INDIKATOR (Bawah Judul di HP, Kiri-Kanan di PC) */}
          <div className="flex justify-between items-center w-full md:absolute md:inset-0 md:px-6 pointer-events-none">
            
            {/* 🌟 TOMBOL REFRESH GLOBAL (Kiri) */}
            {/* pointer-events-auto dikasih biar tombolnya tetap bisa diklik walau wadahnya -none */}
            <div className="z-20 pointer-events-auto">
              <RefreshIcon fetchDashboardData={fetchDashboardData} isRefreshing={isRefreshing} />
            </div>

            {/* INDIKATOR DIVISI (Kanan) */}
            <div className="z-20 scale-90 md:scale-100 flex-shrink-0 origin-right pointer-events-auto">
              <IndikatorDivisi namaDivisi={divisi} warna="#67E8F9" />
            </div>

          </div>
        </header>

        {/* 3. GRID KALENDER & TO-DO */}
        <div className='flex flex-col lg:grid lg:grid-cols-2 px-0 md:px-2 gap-6 md:gap-4 w-full'>
            
            {/* Kalender Section */}
            <div className='bg-white rounded-md px-4 pb-2 w-full min-w-0'>
                
                {/* WADAH SWITCH GLOBAL/DIVISI (Kembali ke tengah/kanan) */}
                <div className="flex justify-center md:justify-end px-2 pt-4 md:pt-2 my-2 w-full">
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
                   <Calendar viewMode={viewMode} events={kalender} />
                </div>
            </div>
            
            {/* Todo Section */}
            <div className="w-full min-w-0">
               <Todo viewMode={viewMode} tasks={todos} />
            </div>
            
        </div>
      </main>
    </div>
  );
}

export default Dashboard;