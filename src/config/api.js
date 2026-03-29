import axios from 'axios';

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
  // Ambil token langsung dari LocalStorage Zustand (tanpa import hook)
  const stored = localStorage.getItem('bakti-auth-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      // Jika parsing gagal, abaikan
    }
  }
  return config;
});

export default api;
