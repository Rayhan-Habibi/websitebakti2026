import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiClipboard, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'; // Tambahkan FiMenu dan FiX
import baktiLogo from '../assets/Icons/BaktiLogo.webp';
import QrIcon from './Icons/QrIcon';
import TodoIcon from './Icons/TodoIcon';
import DashboardIcon from './Icons/DashboardIcon';
import LogoutIcon from './Icons/LogoutIcon';
import DataPanitiaIcon from './Icons/DataPanitiaIcon';

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState('absensi');
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. STATE BARU UNTUK MENU HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [currentRole, setCurrentRole] = useState('kestari'); 
  const currentRoute = location.pathname.split('/').filter(Boolean).pop();

  // Konfigurasi Navigasi
  const baseNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon, path: '/panitia/dashboard'},
    { id: 'absensi', name: 'Absensi', icon: QrIcon, path: '/panitia/absensi' },
    { id: 'todo', name: 'To-Do List', icon: TodoIcon, path: '/panitia/todo' },
  ];

  let navItems = [...baseNavItems]; 

  if (currentRole === 'kestari') {
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

  return (
    <>
      {/* PARENT CONTAINER: Menjadi Navbar di Mobile, Sidebar di Desktop */}
      {/* Perhatikan penambahan class md:... untuk mode desktop */}
      <aside className="fixed top-0 left-0 z-50 bg-sidebar-bg text-white shadow-2xl transition-all duration-300 ease-in-out 
        w-full h-16 flex flex-row items-center px-4 justify-between 
        md:h-screen md:flex-col md:py-6 md:w-15 md:hover:w-72 md:justify-start md:px-0 group"
      >
        
        {/* SPASI KIRI DI MOBILE (Agar Logo bisa persis di tengah) */}
        <div className="w-8 md:hidden"></div>

        {/* 1. LOGO SECTION */}
        {/* Di mobile: tinggi menyesuaikan navbar. Di desktop: tinggi 20 dan ada margin bawah */}
        <div className="flex justify-center items-center flex-shrink-0 md:h-20 md:mb-12">
          <img 
            src={baktiLogo} 
            alt="Logo BAKTI" 
            className="w-10 h-10 object-contain transition-transform md:group-hover:scale-110" 
          />
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
        <nav className="hidden md:flex flex-col flex-grow space-y-2 px-1 w-full">
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
                    {isPlaceholder ? <div className="w-10 h-10 rounded-full bg-sidebar-placeholder" /> : <Icon />}
                  </div>
                  {isPlaceholder ? (
                    <div className="h-7 w-full rounded-md bg-sidebar-placeholder opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100 flex-shrink-0" />
                  ) : (
                    <span className="text-2xl font-medium whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100">
                      {item.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 3. BOTTOM SECTION / LOGOUT (HANYA MUNCUL DI DESKTOP) */}
        <div className="hidden md:block px-1 w-full">
          <div className="flex items-center gap-6 px-4 py-2 rounded-2xl cursor-pointer transition-colors text-white/70 hover:bg-sidebar-active/50 hover:text-white">
            <div className="flex justify-center items-center w-6 text-3xl flex-shrink-0">
              <LogoutIcon />
            </div>
            <span className="text-2xl font-medium whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 delay-100">
              Logout
            </span>
          </div>
        </div>
      </aside>

      {/* 4. DROPDOWN MENU MOBILE (MUNCUL KALAU HAMBURGER DIKLIK) */}
      {/* Menggunakan fixed agar melayang menutupi konten di bawahnya */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-sidebar-bg/95 backdrop-blur-md shadow-2xl flex flex-col md:hidden z-40 border-t border-white/10 animate-fade-in pb-6 pt-4 px-4 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            
            return (
              <div 
                key={`mobile-${item.id}`}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-colors
                  ${isActive ? 'bg-sidebar-active text-white font-bold' : 'text-white/80 hover:bg-sidebar-active/50'}
                `}
              >
                <div className="text-2xl"><Icon /></div>
                <span className="text-xl">{item.name}</span>
              </div>
            )
          })}
          
          {/* Pembatas untuk Logout di HP */}
          <div className="w-full h-[1px] bg-white/20 my-2"></div>
          
          {/* Tombol Logout Mobile */}
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer text-red-400 hover:bg-red-500/20 transition-colors">
            <div className="text-2xl"><LogoutIcon /></div>
            <span className="text-xl font-bold">Logout</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;