'use client'
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import axiosInstance from "../../services/apiReq";
import useAuthStore from "../../store/authStore";
import useArticleStore from "../../store/articleStore";

const Page = () => {
  const { clearAuth } = useAuthStore();
  const { articles,setArticles } = useArticleStore();
  const queryClient = useQueryClient();

  // Fetch articles function
  const fetchArticles = async () => {
    const response = await axiosInstance.get("/articles");
    setArticles(response.data);
    return response.data
  };

  const [newArticle, setNewArticle] = useState({ title: '', description: '', body: '' });

  // Mutation for adding a new article
  const addArticle = async (newArticle) => {
    const response = await axiosInstance.post("/articles", {
      title: newArticle.title,
      description: newArticle.description,
      body: newArticle.body,
    });
    return response.data; // Return the added article data
  };

  // Using TanStack Query to fetch the articles
  const {error, isLoading, isError } = useQuery({
    
    queryKey: ['articles'], // Unique key for the query
    queryFn: fetchArticles, // The query function
   //onSuccess cant be used in tanstack version 5 so it is removed
  });

  // Mutation for adding a new article
  const mutation = useMutation({
    mutationFn: addArticle,
    onSuccess: () => {
      // Optionally, refetch the articles after a successful addition
      queryClient.invalidateQueries(['articles']);
    },
    onError: (error) => {
      console.error('Error adding article:', error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(newArticle); // Trigger the mutation to add the article
    setNewArticle({ title: '', description: '', body: '' }); // Reset form
  };

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

      {/* Display error message for adding article */}
      {mutation.isError && <p style={{ color: 'red' }}>Error adding article: {mutation.error.message}</p>}

      <h2>Add Articles</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={newArticle.title}
            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            required
          />
        </label>
        <br />

        <label>
          Description:
          <input
            type="text"
            value={newArticle.description}
            onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
          />
        </label>
        <br />

        <label>
          Body:
          <input
            type="text"
            value={newArticle.body}
            onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Add Article</button>
      </form>

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
