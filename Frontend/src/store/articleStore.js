import {create} from 'zustand';

const useArticleStore = create((set) => ({
  articles: [], // Store the list of articles
  setArticles: (articles) => set({ articles }), // Set the list of articles

   // Add a new article
   addArticle: (newArticle) => set((state) => ({
    articles: [...state.articles, newArticle],
    
  })),

  article: null, // Single article (if needed for details)
  setArticle: (articleData) => set({ article: articleData }), // Set a single article
}));

export default useArticleStore;

