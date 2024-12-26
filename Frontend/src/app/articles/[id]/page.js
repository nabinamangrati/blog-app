"use client";
import React, { use } from "react";
import { useState,useEffect } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";
import jwt from 'jsonwebtoken';

const ArticleDetail = ({params}) => {
  const {article, setArticle} = useArticleStore();

  const { id } = use(params); // Extract the user ID from params
  // console.log("id",id)

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedArticle, setUpdatedArticle] = useState({
    title: "",
    description: "",
    body: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwt.decode(token); // Decode the token
        // console.log("Decoded token", decodedToken.userId);
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
    setUpdatedArticle({
      title: response.data.title,
      description: response.data.description,
      body: response.data.body,
    });
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

  const mutationDelete = useMutation({
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
      // console.log("article user",article.author.id)

    if (window.confirm("Are you sure you want to delete this article?")) {
      mutationDelete.mutate(id); // Trigger the mutation
      if(window.confirm("You have successfully deleted the article. Get back to the articles page?")){
        window.location.href = '/articles';
      }
    }
 }

 const updateArticle = async ({id,updatedArticle}) => {
  // console.log("id from update",typeof(id), id)
  // console.log("updatedArticle",updatedArticle)
  if (!id) {
    throw new Error("No article ID provided for deletion");
  }
  await axiosInstance.patch(`/articles/${id}`,updatedArticle);

};

const mutationUpdate = useMutation({
  mutationFn: updateArticle,
  // onSuccess: () => {
  //   alert("Article deleted successfully");
  //   // router.replace("/articles"); // Redirect to articles list
  // },
  onError: (err) => {
    alert(err.response?.data?.message || "Failed to update the article");
  },
});
 const handleEdit=()=>{
  setIsEditing(true);
  }

  const handleSave = async (e) => {
    e.preventDefault()
    // console.log("handlesave called")
    // console.log("id from save",typeof(id))
    if (window.confirm("Are you sure you want to update this article?")) {
       mutationUpdate.mutate({id, updatedArticle}); // Trigger update
      if(window.confirm("You have successfully updated the article. Get back to the articleDetail page?")){
        window.location.href = `/articles/${id}`;
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message || "An error occurred."}</p>;
  }

  const isOwner = loggedInUser?.userId === article?.authorId;
  
  return (
    <div>
      {isEditing ? (
        <div>
          <h1>Edit Article</h1>
          <form onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission
           handleSave(e);
          }}>
            <div>
              <label>Title: </label>
              <input
                type="text"
                value={updatedArticle.title}
                onChange={(e) =>
                  setUpdatedArticle({ ...updatedArticle, title: e.target.value })
                }
              />
            </div>
            <div>
              <label>Description: </label>
              <input
                value={updatedArticle.description}
                onChange={(e) =>
                  setUpdatedArticle({ ...updatedArticle, description: e.target.value })
                }
              />
            </div>
            <div>
              <label>Body: </label>
              <input
                value={updatedArticle.body}
                onChange={(e) =>
                  setUpdatedArticle({ ...updatedArticle, body: e.target.value })
                }
              />
            </div>
            <button type="submit" disabled={mutationUpdate.isLoading}>
            {mutationUpdate.isLoading ? "Updating..." : "Save"}
          </button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      ) : (
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
            <strong>Author:</strong> {article.author?.name}
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
            <div>
              <button onClick={handleDelete} disabled={mutationDelete.isLoading}>
                {mutationDelete.isLoading ? "Deleting..." : "Delete"}
              </button>
              <button onClick={handleEdit}>Edit</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}  
export default ArticleDetail;
