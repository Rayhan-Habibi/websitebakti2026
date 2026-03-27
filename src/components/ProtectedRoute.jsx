import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore'; // Import gudang Zustand kita

function ProtectedRoute() {
  // 1. Cek isi  (Zustand) apakah ada token
  const token = useAuthStore((state) => state.token);

  // 2. Kalau nggak ada token, tendang ke halaman Login!
  // 'replace' gunanya biar user nggak bisa klik tombol 'Back' di browser untuk maksa masuk lagi
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Kalau ada token, silakan masuk! 
  // (<Outlet /> ini artinya "Tampilkan halaman tujuan aslinya")
  return <Outlet />;
}

export default ProtectedRoute;