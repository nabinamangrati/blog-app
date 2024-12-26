"use client";
import React, { use } from "react";
import { useState,useEffect } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";
import jwt from 'jsonwebtoken';


const ArticleDetail = ({ params }) => {
  const {article, setArticle} = useArticleStore();

  const { id } = use(params); // Extract the user ID from params

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwt.decode(token); // Decode the token
        console.log("Decoded token", decodedToken.userId);
        setLoggedInUser(decodedToken); // Store the decoded user info
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const fetchArticleDetails = async (id) => {
    if (!id) {  
      throw new Error("No article ID provided");
    }
    const response = await axiosInstance.get(`/articles/${id}`);
    setArticle(response.data);
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

  const deleteArticle = async (id) => {
    if (!id) {
      throw new Error("No article ID provided for deletion");
    }
    await axiosInstance.delete(`/articles/${id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteArticle,
    // onSuccess: () => {
    //   alert("Article deleted successfully");
    //   // router.replace("/articles"); // Redirect to articles list
    // },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete the article");
    },
  });

  const handleDelete=async()=>{
      console.log("article user",article.author.id)

    if (window.confirm("Are you sure you want to delete this article?")) {
      mutation.mutate(id); // Trigger the mutation
      if(window.confirm("You have successfully deleted the article. Get back to the articles page?")){
        window.location.href = '/articles';
      }
    }
 }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message || "An error occurred."}</p>;
  }
  // console.log("loggedInUser",loggedInUser?.userId)
  // console.log("article author",article?.authorId)

  const isOwner = loggedInUser?.userId === article?.authorId;
  
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
        <strong>Published on:</strong>
        {new Date(article.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Last Updated:</strong>
        {new Date(article.updatedAt).toLocaleString()}
      </p>
      {isOwner && (
      <button onClick={handleDelete} disabled={mutation.isLoading}>
        {mutation.isLoading ? "Deleting..." : "Delete"}
      </button>
          )}
       </div>
  );
};

export default ArticleDetail;
