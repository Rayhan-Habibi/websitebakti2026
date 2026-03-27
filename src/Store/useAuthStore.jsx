// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  // persist adalah asisten ajaib yang mem-backup data ke Local Storage otomatis
  persist(
    (set) => ({
      // 1. BARANG (State/Data)
      token: null,
      tempToken: null, // Ini buat nyimpen token sementara saat user harus ganti password dulu
      user: null,
      
      // 2. PETUGAS (Actions/Fungsi)
      // Fungsi ini dipanggil saat login sukses
      login: (newToken, userData) => set({ token: newToken, user: userData }),

      //Jika user harus ubah password dulu
      setTempToken: (tokenSementara) => set({ 
        tempToken: tokenSementara 
      }),
      clearTempToken: () => set({ 
        tempToken: null 
      }),
      
      // Fungsi ini dipanggil saat tombol Keluar/Logout ditekan
      logout: () => set({ token: null, user: null, tempToken: null }),
    }),
    {
      name: 'bakti-auth-storage', // Ini nama kuncinya pas dicek di Inspect Element > Application > Local Storage
    }
  )
);

export default useAuthStore;