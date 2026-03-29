// src/store/useAuthStore.js
import api from '../config/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 1. State
      token: null,
      tempToken: null,
      user: {},
      role: null,
      
      // 2. Actions
      login: (newToken, newRole) => set({ token: newToken, role: newRole }),

      setTempToken: (tokenSementara) => set({ tempToken: tokenSementara }),
      clearTempToken: () => set({ tempToken: null }),

      fetchUserData: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const response = await api.get('/api/auth/me');
          set({ user: response.data.data });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },

      // FIX: Reset user ke {} (bukan null) agar konsisten dengan initial state
      logout: () => set({ token: null, user: {}, role: null, tempToken: null }),
    }),
    {
      name: 'bakti-auth-storage',
    }
  )
);

export default useAuthStore;