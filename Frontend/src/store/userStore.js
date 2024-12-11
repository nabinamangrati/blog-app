// src/store/userStore.js
import {create} from 'zustand';

const useUserStore = create((set) => ({
  user: null, // Initially no user data
  setUser: (userData) => set({ user: userData }), // Set user data
  clearUser: () => set({ user: null }), // Clear user data (e.g., on logout)
}));

export default useUserStore;
