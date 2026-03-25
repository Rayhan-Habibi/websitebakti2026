import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Absensi from './pages/Absensi'
import TodoPage from './pages/TodoPage'
import PanitiaLayout from './Layouts/PanitiaLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/panitia" element={<PanitiaLayout />}>
        <Route path="/panitia/dashboard" element={<Dashboard />} />
        <Route path="/panitia/absensi" element={<Absensi />} />
        <Route path="/panitia/todo" element={<TodoPage />} />
      </Route>

      {/* Route dengan path="*" ini sangat penting untuk menangani halaman 404 (Not Found) */}
      <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
    </Routes>
  )
}

export default App
