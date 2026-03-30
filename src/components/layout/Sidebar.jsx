import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, } from 'react-icons/fi'; // Tambahkan FiMenu dan FiX
import baktiLogo from '../../assets/Icons/BaktiLogo.webp';
import QrIcon from '../ui/Icons/QrIcon';
import TodoIcon from '../ui/Icons/TodoIcon';
import DashboardIcon from '../ui/Icons/DashboardIcon';
import LogoutIcon from '../ui/Icons/LogoutIcon';
import DataPanitiaIcon from '../ui/Icons/DataPanitiaIcon';
import useAuthStore from '../../Store/useAuthStore';

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState('absensi');
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const currentRole = useAuthStore((state) => state.role);
  const currentDivisi = useAuthStore((state) => state.user?.divisi?.nama_divisi);
  // 1. STATE BARU UNTUK MENU HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentRoute = location.pathname.split('/').filter(Boolean).pop();

  // Konfigurasi Navigasi
  const baseNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon, path: '/panitia/dashboard'},
    { id: 'absensi', name: 'Absensi', icon: QrIcon, path: '/panitia/absensi' },
    { id: 'todo', name: 'To-Do List', icon: TodoIcon, path: '/panitia/todo' },
  ];

  let navItems = [...baseNavItems]; 

  if (currentRole === "INTI" || currentDivisi === "Kestari" || currentRole === "PRESIDIUM") {
    navItems.push(
      { id: 'data-panitia', name: 'Data Panitia', icon: DataPanitiaIcon, path: '/panitia/data-panitia' }
    );
  } 

  // Fungsi untuk handle klik menu (navigasi sekaligus tutup menu di HP)
  const handleNavigation = (path, id) => {
    setActiveMenu(id);
    navigate({ pathname: path });
    setIsMobileMenuOpen(false); // Tutup menu HP setelah diklik
  };

  //logout logic

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    try {
      setIsLoggingOut(true); 
      setTimeout(() => {
        logout();
        console.log("Logout berhasil!");
        navigate('/login');
        // Nggak perlu setIsLoggingOut(false) karena saat pindah halaman, komponen Sidebar ini akan otomatis mati/hilang.
      }, 800);
      } catch (error) {
        console.error("Logout error:", error);
        alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
      }
  }


  return (
    <>
      {/* PARENT CONTAINER: Menjadi Navbar di Mobile, Sidebar di Desktop */}
      {/* Perhatikan penambahan class md:... untuk mode desktop */}
      <aside className="fixed top-0 left-0 z-50 bg-sidebar-bg text-white shadow-2xl transition-all duration-300 ease-in-out 
        w-full h-16 flex flex-row items-center px-4 justify-between 
        md:h-screen md:flex-col md:py-6 md:w-15 md:hover:w-60 md:justify-start md:px-0 group"
      >
        
        {/* SPASI KIRI DI MOBILE (Agar Logo bisa persis di tengah) */}
        <div className="w-8 md:hidden"></div>

        {/* 1. LOGO SECTION */}
        {/* Di mobile: tinggi menyesuaikan navbar. Di desktop: tinggi 20 dan ada margin bawah */}
        <div 
          onClick={() => navigate('/')}
          className="flex justify-center items-center md:group-hover:justify-start md:group-hover:px-5 flex-shrink-0 md:h-20 md:mb-12 transition-all duration-300 cursor-pointer overflow-hidden w-auto md:w-full"
        >
          <img 
            src={baktiLogo} 
            alt="Logo BAKTI" 
            className="w-10 h-10 object-contain transition-transform md:group-hover:scale-110 flex-shrink-0" 
          />
          <div className="w-0 opacity-0 overflow-hidden transition-all duration-300 md:group-hover:w-auto md:group-hover:opacity-100 md:group-hover:ml-4 hidden md:flex flex-col">
            <span className="font-black text-[17px] whitespace-nowrap text-white tracking-wider leading-none">
              BAKTI UNAND
            </span>
            <span className="font-bold text-[13px] whitespace-nowrap text-[#91C397] tracking-widest mt-1">
              2026
            </span>
          </div>
        </div>

        {/* TOMBOL HAMBURGER DI MOBILE (Berada di ujung kanan) */}
        <div className="w-8 flex justify-end md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* 2. NAVIGATION MENU SECTION (HANYA MUNCUL DI DESKTOP) */}
        <nav className="hidden md:flex flex-col flex-grow space-y-6 px-1 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            const isPlaceholder = item.icon === 'placeholder';

            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-sidebar-accent rounded-r-full" />
                )}
                <div
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`flex items-center gap-3 px-4 py-1 rounded-2xl cursor-pointer transition-colors
                    ${isActive ? 'bg-sidebar-active text-white' : 'text-white/70 hover:bg-sidebar-active/50 hover:text-white'}
                  `}
                >
                  <div className="flex justify-center items-center w-5 text-xl flex-shrink-0">
                    {isPlaceholder ? <div className="w-10 h-10 rounded-full bg-sidebar-placeholder" /> : <Icon width={32} height={32} />}
                  </div>
                  {isPlaceholder ? (
                    <div className="h-7 w-full rounded-md bg-sidebar-placeholder opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100 flex-shrink-0" />
                  ) : (
                    <span className="text-md font-medium whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100">
                      {item.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 3. BOTTOM SECTION / LOGOUT (HANYA MUNCUL DI DESKTOP) */}
        <div className="hidden md:block px-1 w-full pb-6">
          <div 
            onClick={!isLoggingOut ? handleLogout : undefined}
            className={`flex items-center gap-6 px-4 py-2 rounded-2xl transition-colors ${
              isLoggingOut 
                ? 'opacity-70 cursor-not-allowed text-white' 
                : 'cursor-pointer text-white/70 hover:bg-sidebar-active/50 hover:text-white'
            }`}
          >
            <div className="flex justify-center items-center w-6 text-3xl flex-shrink-0">
              {isLoggingOut ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogoutIcon width={32} height={32} />
              )}
            </div>
            <span className="text-md font-medium whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100">
              {isLoggingOut ? 'Keluar...' : 'Logout'}
            </span>
          </div>
        </div>
      </aside>

      {/* 4. DROPDOWN MENU MOBILE (MUNCUL KALAU HAMBURGER DIKLIK) */}
      {/* Menggunakan fixed agar melayang menutupi konten di bawahnya */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-sidebar-bg/95 backdrop-blur-md shadow-2xl flex flex-col md:hidden z-40 border-t border-white/10 animate-fade-in pb-4 pt-3 px-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            
            return (
              <div 
                key={`mobile-${item.id}`}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors
                  ${isActive ? 'bg-sidebar-active text-white font-bold' : 'text-white/80 hover:bg-sidebar-active/50'}
                `}
              >
                <div className="text-base flex-shrink-0"><Icon width={22} height={22} /></div>
                <span className="text-md truncate">{item.name}</span>
              </div>
            )
          })}
          
          {/* Pembatas untuk Logout di HP */}
          <div className="w-full h-[1px] bg-white/20 my-4"></div>
          
          {/* Tombol Logout Mobile */}
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl w-full text-left transition-colors ${
              isLoggingOut 
                ? 'opacity-70 cursor-not-allowed text-red-300' 
                : 'cursor-pointer text-red-400 hover:bg-red-500/20'
            }`}
          >
            <div className="text-base flex-shrink-0">
              {isLoggingOut ? (
                <svg className="animate-spin h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogoutIcon width={22} height={22} />
              )}
            </div>
            <span className="text-sm font-bold truncate">{isLoggingOut ? 'Keluar...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </>
  );
}

export default Sidebar;