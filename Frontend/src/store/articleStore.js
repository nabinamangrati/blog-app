// src/store/articleStore.js
import {create} from 'zustand';

const useArticleStore = create((set) => ({
  article: null, // Initially no user data
  setArticle: (articleData) => set({ article: articleData }), // Set user data
//   clearArticle: () => set({ article: null }), // Clear article data (e.g., on logout)
}));

export default useArticleStore;
