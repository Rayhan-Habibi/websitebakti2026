import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Absensi from './pages/Absensi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/absensi" element={<Absensi />} />
      
      {/* Route dengan path="*" ini sangat penting untuk menangani halaman 404 (Not Found) */}
      <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
    </Routes>
  )
}

export default App
