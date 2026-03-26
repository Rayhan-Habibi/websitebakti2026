import { use, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Gunakan NavLink untuk styling aktif
import { FiGrid, FiClipboard, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
// Import logo (sesuaikan path-nya)
import baktiLogo from '../assets/Icons/BaktiLogo.webp';
import QrIcon from './Icons/QrIcon';
import TodoIcon from './Icons/TodoIcon';
import { useLocation } from 'react-router-dom';
import DashboardIcon from './Icons/DashboardIcon';
import LogoutIcon from './Icons/LogoutIcon';

function Sidebar() {
  // SIMULASI MENU AKTIF: Dalam praktiknya, React Router otomatis menangani ini dengan NavLink
  const [activeMenu, setActiveMenu] = useState('absensi');
  const navigate = useNavigate(); // Hook untuk navigasi programatik

  const location = useLocation();
  
  // Contoh: Jika URL saat ini adalah "website.com/dashboard/absensi"
  // location.pathname akan bernilai "/dashboard/absensi"
  // Setelah di-split dan pop, currentRoute = "absensi"
  const currentRoute = location.pathname.split('/').filter(Boolean).pop();

  // Konfigurasi Navigasi
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon, path: '/panitia/dashboard'},
    { id: 'absensi', name: 'Absensi', icon: QrIcon, path: '/panitia/absensi' },
    { id: 'todo', name: 'To-Do List', icon: TodoIcon, path: '/panitia/todo' },
    // Ikon placeholder bulat abu-abu sesuai desain Anda
  ]

  return (
    // PARENT: sidebar-bg (warna custom v4), transisi lebar 24px -> 288px (w-72) saat hover
    <aside className="bg-green fixed top-0 left-0 h-screen bg-sidebar-bg text-white flex flex-col py-6 shadow-2xl z-50 transition-all duration-300 ease-in-out overflow-hidden w-20 hover:w-72 group">
      
      {/* 1. LOGO SECTION */}
      <div className="flex justify-center items-center h-20 mb-12 flex-shrink-0">
        {/* Logo Icon tetap di tengah */}
        <img 
          src={baktiLogo} 
          alt="Logo BAKTI" 
          className="w-14 h-14 object-contain transition-transform group-hover:scale-110" 
        />
        {/* Teks Logo muncul saat hover (jika desain asli ada teksnya) */}
        {/* <span className="absolute left-24 text-2xl font-bold font-serif whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity delay-100">BAKTI UNAND</span> */}
      </div>

      {/* 2. NAVIGATION MENU SECTION */}
      <nav className="flex-grow space-y-4 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          const path = item.path;

          // Cek apakah menu aktif atau placeholder
          const isPlaceholder = item.icon === 'placeholder';

          return (
            <div key={item.id} onClick={() => setActiveMenu(item.id)} className="relative">
              {/* Garis Aksen Terang di kiri menu aktif */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-sidebar-accent rounded-r-full" />
              )}

              {/* ITEM MENU */}
              <div
                onClick={() => navigate({ pathname: path })}
                className={`flex items-center gap-6 px-4 py-2 rounded-2xl cursor-pointer transition-colors
                  ${isActive 
                    ? 'bg-sidebar-active text-white' // Styling Aktif sesuai desain
                    : 'text-white/70 hover:bg-sidebar-active/50 hover:text-white' // Styling Inaktif
                  }
                `}
              >
                {/* Bagian Ikon (Lebar Tetap) */}
                <div className="flex justify-center items-center w-6 text-3xl flex-shrink-0">
                  {isPlaceholder ? (
                    // Placeholder bulat abu-abu
                    <div className="w-12 h-12 rounded-full bg-sidebar-placeholder" />
                  ) : (
                    // Ikon asli
                    <Icon />
                  )}
                </div>

                {/* Bagian Teks Label (Muncul saat hover group) */}
                {isPlaceholder ? (
                  // Placeholder kotak abu-abu
                  <div className="h-7 w-full rounded-md bg-sidebar-placeholder opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 flex-shrink-0" />
                ) : (
                  // Teks asli
                  <span className="text-2xl font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    {item.name}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 3. BOTTOM SECTION (Tombol Logout) */}
      {/* Tambahkan px-3 pb-6 agar rata kiri-kanannya sama persis dengan menu navigasi di atas */}
      <div className="px-3">
        <div 
          className="flex items-center gap-6 px-4 py-2 rounded-2xl cursor-pointer transition-colors text-white/70 hover:bg-sidebar-active/50 hover:text-white"
        >
          {/* BUNGKUS IKON: Ini pelindung agar ikon tidak gepeng saat sidebar mengecil */}
          <div className="flex justify-center items-center w-6 text-3xl flex-shrink-0">
            <LogoutIcon />
          </div>

          {/* TEKS LOGOUT: Hanya muncul saat sidebar di-hover */}
          <span className="text-2xl font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;