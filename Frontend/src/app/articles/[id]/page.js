'use client'
import React, { useEffect, useState } from 'react';

const ArticleDetail = ({ params }) => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    // Unwrapping the params and getting the id
    const fetchData = async () => {
      const { id: articleId } = await params;  // Unwrap the params to get the id
      setId(articleId);
      
      if (!articleId) {
        setError("No article id provided");
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You need to log in to access the articles.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
            // Token expired, set error message
            setError("Your session has expired. Please log in again.");
            return;
          }

        if (!res.ok) {
          setError("Article not found");
          return;
        }

        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError("Error fetching article");
      }
    };

    fetchData();
  }, [params]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1><strong>Title:</strong> {article.title}</h1>
      <p><strong>Description: </strong>{article.description}</p>
      <p><strong>Body:</strong> {article.body}</p>
      <p><strong>Author:</strong>{article.author?.name}</p>
      <p><strong>Published on:</strong> {new Date(article.createdAt).toLocaleString()}</p>
      <p><strong>Last Updated:</strong> {new Date(article.updatedAt).toLocaleString()}</p>
    
    </div>
  );
};

export default ArticleDetail;
