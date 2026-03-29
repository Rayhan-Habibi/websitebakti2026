import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import useAuthStore from '../Store/useAuthStore'

function PanitiaLayout() {
  // FIX: Fetch user data di layout level, bukan di Sidebar
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || !user.nama) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F1F3F4]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="w-full border-t-2 border-gray-400 text-center py-1 bg-[#F1F3F4] text-[#133F25]/60 mt-auto md:pl-24 flex-shrink-0">
          <span className="text-xs font-bold text-green-800 tracking-wider">
            © 2026 Developed by Neo Telemetri × Bakti UNAND.
          </span>
        </footer>
      </main>
    </div>
  )
}

export default PanitiaLayout
