'use client'
import {useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import axiosInstance from "../../services/apiReq";
import useAuthStore from "../../store/authStore";
import useArticleStore from "../../store/articleStore";

const Page = () => {
  const { clearAuth } = useAuthStore();
  const { articles,setArticles } = useArticleStore();

  // Fetch articles function
  const fetchArticles = async () => {
    const response = await axiosInstance.get("/articles");
    setArticles(response.data);
    return response.data
  };

  // Using TanStack Query to fetch the articles
  const {error, isLoading, isError } = useQuery({
    
    queryKey: ['articles'], // Unique key for the query
    queryFn: fetchArticles, // The query function
   //onSuccess cant be used in tanstack version 5 so it is removed
  });

  // Handle logout
  const handleLogout = () => {
    clearAuth(); // Clear the authentication state from Zustand store
    window.location.href = '/login';  // Redirect to login page
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Articles</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* List of articles */}
      <ul>
        {articles.map((article, index) => (
          <li key={article.id}>
            <p>
              {index + 1}. Title: 
              <Link href={`/articles/${article.id}`}>
                {article.title}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
