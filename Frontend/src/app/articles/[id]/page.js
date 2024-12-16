"use client";
import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";



const ArticleDetail = ({ params }) => {
  const {article, setArticle} = useArticleStore();

  const { id } = use(params); // Extract the user ID from params

  const fetchArticleDetails = async (id) => {
    if (!id) {  
      throw new Error("No article ID provided");
    }
    const response = await axiosInstance.get(`/articles/${id}`);
    setArticle(response.data)
    return response.data;
  };
  // Use the `useQuery` hook to fetch user details
  const {
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id], // Unique key for caching based on the user ID
    queryFn: () => fetchArticleDetails(id), // Fetch function
    enabled: !!id, // Ensure the query only runs if an ID is provided
   
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message || "An error occurred."}</p>;
  }

  return (
    <div>
      <h1>
        <strong>Title:</strong> {article.title}
      </h1>
      <p>
        <strong>Description: </strong>
        {article.description}
      </p>
      <p>
        <strong>Body:</strong> {article.body}
      </p>
      <p>
        <strong>Author:</strong>
        {article.author?.name}
      </p>
      <p>
        <strong>Published on:</strong>{" "}
        {new Date(article.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(article.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default ArticleDetail;
