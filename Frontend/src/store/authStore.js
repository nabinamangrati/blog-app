// src/store/useAuthStore.js
import create from 'zustand';

const useAuthStore = create((set) => ({
  authToken: localStorage.getItem("authToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  
  setAuthToken: (token) => {
    localStorage.setItem("authToken", token);
    set({ authToken: token });
  },

  setRefreshToken: (token) => {
    localStorage.setItem("refreshToken", token);
    set({ refreshToken: token });
  },

  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    set({ authToken: null, refreshToken: null });
  },
}));

export default useAuthStore;
