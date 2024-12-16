"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";

const Drafts = () => {
  const { articles, setArticles } = useArticleStore();
  const fetchDrafts = async () => {
    const response = await axiosInstance.get("/articles/drafts");
    setArticles(response.data);
    return response.data;
  };

  const {
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles"], // Unique key for the query
    queryFn: fetchDrafts, // The query function
    
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h2>Drafts</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={article.id}>
            <p>
              {" "}
              {index + 1} Title:
              <Link href={`/articles/${article.id}`}>{article.title}</Link>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Drafts;
