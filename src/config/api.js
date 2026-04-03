import axios from 'axios';
import useAuthStore from '../Store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // Memaksa browser untuk tidak pernah melakukan cache (menyelesaikan masalah data nyangkut setelah logout)
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
});

// Interceptor: Otomatis tambahkan header Authorization ke setiap request
api.interceptors.request.use((config) => {
  // Ambil token dari Zustand store langsung (tanpa hook, pakai getState)
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag untuk mencegah multiple redirect bersamaan (race condition)
let isRedirectingToLogin = false;

// Interceptor: Otomatis logout jika token sudah expire (response 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentToken = useAuthStore.getState().token;

      // Cek apakah memang ada token yang tersimpan (berarti ini bukan halaman login)
      if (currentToken && !isRedirectingToLogin) {
        isRedirectingToLogin = true;

        // Gunakan logout() dari Zustand agar state di memori DAN localStorage konsisten
        useAuthStore.getState().logout();

        // Redirect ke halaman login
        window.location.href = '/login';
      }

      // Kembalikan promise yang tidak pernah resolve/reject
      // Ini mencegah catch block di komponen menampilkan alert error yang membingungkan
      // karena halaman akan segera redirect ke login
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
