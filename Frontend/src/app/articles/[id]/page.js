"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ArticleDetail = ({ params }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const { article, setArticle } = useArticleStore();

  const { id } = use(params); // Extract the user ID from params

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
  const { error, isLoading, isError } = useQuery({
    queryKey: ["article", id], // Unique key for caching based on the user ID
    queryFn: () => fetchArticleDetails(id), // Fetch function
    enabled: !!id, // Ensure the query only runs if an ID is provided
  });

  const deleteArticle = async ({ id }) => {
    if (!id) {
      throw new Error("No article ID provided for deletion");
    }
    await axiosInstance.delete(`/articles/${id}`);
  };

  const mutationDelete = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      window.location.href = "/articles";
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete the article");
    },
  });

  const handleDelete = async () => {
    setIsDeleteDialogOpen(true);
  };

  const updateArticle = async ({ id, updatedArticle }) => {
    if (!id) {
      throw new Error("No article ID provided for deletion");
    }
    await axiosInstance.patch(`/articles/${id}`, updatedArticle);
  };

  const mutationUpdate = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      window.location.href = `/articles/${id}`;
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to update the article");
    },
  });
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaveDialogOpen(true);
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
        <div className="flex justify-center items-center min-h-screen">
          <Card>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
            </CardHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission
                handleSave(e);
              }}
            >
              <CardContent>
                <div>
                  <Label>Title </Label>
                  <Input
                    type="text"
                    value={updatedArticle.title}
                    onChange={(e) =>
                      setUpdatedArticle({
                        ...updatedArticle,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Description </Label>
                  <Input
                    value={updatedArticle.description}
                    onChange={(e) =>
                      setUpdatedArticle({
                        ...updatedArticle,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Body </Label>
                  <Input
                    value={updatedArticle.body}
                    onChange={(e) =>
                      setUpdatedArticle({
                        ...updatedArticle,
                        body: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
              <div>
                <CardFooter className="flex gap-4">
                  <Button type="submit" disabled={mutationUpdate.isLoading}>
                    {mutationUpdate.isLoading ? "Updating..." : "Save"}
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <Card>
            <CardHeader>
              <CardTitle>
                <strong>Title: </strong>
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Description: </strong>
                {article.description}
              </p>
              <strong>Body:</strong> {article.body}
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
            </CardContent>
            {isOwner && (
              <div>
                <CardFooter className="flex gap-4">
                  <Button
                    onClick={handleDelete}
                    disabled={mutationDelete.isLoading}
                  >
                    {mutationDelete.isLoading ? "Deleting..." : "Delete"}
                  </Button>
                  <Button onClick={handleEdit}>Edit</Button>
                </CardFooter>
              </div>
            )}
          </Card>
        </div>
      )}
      {/* Save Confirmation Dialog (Alert Dialog for Save) */}
      <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to save changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you want to save the changes to this article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                handleSave(e); // Trigger the save action
                mutationUpdate.mutate({ id, updatedArticle }); // Trigger update
                setIsSaveDialogOpen(false); // Close the dialog
              }}
            >
              {mutationUpdate.isLoading ? "Saving..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog (Alert Dialog for Delete) */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this article?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Are you sure you want to delete this
              article?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                mutationDelete.mutate({ id });
              }}
            >
              {mutationDelete.isLoading ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default ArticleDetail;
