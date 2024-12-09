'use client'
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/apiReq';

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

      try {
        const response = await axiosInstance.get(`/articles/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred.");
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
