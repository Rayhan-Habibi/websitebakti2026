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

// Interceptor: Otomatis logout jika token sudah expire (response 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus auth state dari Zustand store
      const stored = localStorage.getItem('bakti-auth-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Cek apakah memang ada token yang tersimpan (berarti ini bukan halaman login)
          if (parsed?.state?.token) {
            // Reset state di localStorage
            parsed.state = { token: null, tempToken: null, user: {}, role: null };
            localStorage.setItem('bakti-auth-storage', JSON.stringify(parsed));

            // Redirect ke halaman login
            window.location.href = '/login';
          }
        } catch (e) {
          // Jika parsing gagal, abaikan
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
