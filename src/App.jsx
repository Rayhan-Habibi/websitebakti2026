import './App.css'
import LandingPage from './pages/PanitiaKoordinator/LandingPage'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Dashboard from './pages/PanitiaKoordinator/Dashboard'
import Absensi from './pages/PanitiaKoordinator/Absensi'
import TodoPage from './pages/PanitiaKoordinator/TodoPage'
import PanitiaLayout from './Layouts/PanitiaLayout'
import DataPanitiaPage from './pages/PanitiaKoordinator/Kestari/DataPanitiaPage'
import DetailDivisiPage from './pages/PanitiaKoordinator/Kestari/DetailDivisiPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ResetPassword from './pages/Auth/ResetPassword'
import { Navigate } from 'react-router-dom'
import useAuthStore from './Store/useAuthStore'

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/panitia/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to={token ? "/panitia/dashboard" : "/login"} replace />} />
      <Route path="lupa-password" element={<ResetPassword/>}/>

      <Route element={<ProtectedRoute />}>
        <Route path="/panitia" element={<PanitiaLayout />}>
          <Route path="/panitia/dashboard" element={<Dashboard />} />
          <Route path="/panitia/absensi" element={<Absensi />} />
          <Route path="/panitia/todo" element={<TodoPage />} />
          <Route path="/panitia/data-panitia" element={<DataPanitiaPage />} />
          <Route path='/panitia/data-panitia/:namaDivisi' element={<DetailDivisiPage />}/>
        </Route>
      </Route>

      {/* Route dengan path="*" ini sangat penting untuk menangani halaman 404 (Not Found) */}
      <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
    </Routes>
  )
}

export default App
