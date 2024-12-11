// src/store/userStore.js
import {create} from 'zustand';

const useUserStore = create((set) => ({
  users: [], // Store the list of users
  setUsers: (users) => set({ users }), // Set the list of articles

  user: null, // Single user (if needed for details)
  setUser: (userData) => set({ user: userData }), // Set a single user
  clearUser: () => set({ user: null }), // Clear user data (e.g., on logout)
}));

export default useUserStore;
