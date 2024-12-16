'use client'
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from "../../services/apiReq";
import useArticleStore from "../../store/articleStore";

const Page = () => {
  // const queryClient = useQueryClient();
  const [newArticle, setNewArticle] = useState({ title: '', description: '', body: '' });

  const addArticleToStore = useArticleStore(state => state.addArticle);  // Access `addArticle` from the store


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
    onMutate: async (newArticle) => {
      addArticleToStore(newArticle);  // Optimistically update Zustand state with the new article
    },
    onSuccess: () => {
      // Optionally, refetch the articles after a successful addition
      // queryClient.invalidateQueries(['articles']);
      console.log('Article added successfully');
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

  return (
    <div>
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
    </div>
  );
};

export default Page;
