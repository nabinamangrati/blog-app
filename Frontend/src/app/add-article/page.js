"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/apiReq";
import useArticleStore from "../../store/articleStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Page = () => {
  // const queryClient = useQueryClient();
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    body: "",
  });

  const addArticleToStore = useArticleStore((state) => state.addArticle); // Access `addArticle` from the store

  // Mutation for adding a new article
  const addArticle = async (newArticle) => {
    const response = await axiosInstance.post("/articles", {
      title: newArticle.title,
      description: newArticle.description,
      body: newArticle.body,
    });
    return response.data; // Return the added article data
  };

  // Mutation for adding a new article
  const mutation = useMutation({
    mutationFn: addArticle,
    onSuccess: (newArticle) => {
      addArticleToStore(newArticle); // Update Zustand state with the new article
      // Optionally, refetch the articles after a successful addition
      // queryClient.invalidateQueries(['articles']);
      console.log("Article added successfully");
    },
    onError: (error) => {
      console.error("Error adding article:", error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(newArticle); // Trigger the mutation to add the article
    setNewArticle({ title: "", description: "", body: "" }); // Reset form
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add Articles</CardTitle>
          <CardDescription>Create a new article.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display error message for adding article */}
          {mutation.isError && (
            <p style={{ color: "red" }}>
              Error adding article: {mutation.error.message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Description</Label>
                <Input
                  type="text"
                  value={newArticle.description}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Body</Label>
                <Input
                  type="text"
                  value={newArticle.body}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, body: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <CardFooter className="flex justify-between">
                <Button type="submit">Add Article</Button>
              </CardFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
