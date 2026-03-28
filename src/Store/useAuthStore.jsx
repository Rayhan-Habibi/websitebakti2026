// src/store/useAuthStore.js
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  // persist adalah asisten ajaib yang mem-backup data ke Local Storage otomatis
  persist(
    (set, get) => ({
      // 1. BARANG (State/Data)
      token: null,
      tempToken: null, // Ini buat nyimpen token sementara saat user harus ganti password dulu
      user: null,
      role: null,
      
      // 2. PETUGAS (Actions/Fungsi)
      // Fungsi ini dipanggil saat login sukses
      login: (newToken, newRole) => set({ token: newToken, role: newRole }),

      //Jika user harus ubah password dulu
      setTempToken: (tokenSementara) => set({ 
        tempToken: tokenSementara 
      }),
      clearTempToken: () => set({ 
        tempToken: null 
      }),

      //fungsi fetch data user
      fetchUserData: async () => {
        const token = get().token; // Ambil token dari state
        if (!token) return;
        try {
          const response = await axios.get('https://api.baktiunand2026.com/api/auth/me', 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            set({ user: response.data.data });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },

      // Fungsi ini dipanggil saat tombol Keluar/Logout ditekan
      logout: () => set({ token: null, user: null, tempToken: null }),
    }),
    {
      name: 'bakti-auth-storage', // Ini nama kuncinya pas dicek di Inspect Element > Application > Local Storage
    }
  )
);

export default useAuthStore;