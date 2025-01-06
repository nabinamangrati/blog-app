"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import axiosInstance from "../../../services/apiReq";
import useArticleStore from "../../../store/articleStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Drafts = () => {
  const { articles, setArticles } = useArticleStore();
  const fetchDrafts = async () => {
    const response = await axiosInstance.get("/articles/drafts");
    setArticles(response.data);
    return response.data;
  };

  const { error, isLoading, isError } = useQuery({
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black-200">Drafts</h2>
      <Button>
        <Link href="/add-article">Create new article</Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <Card
            key={article.id}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg p-4 border border-gray-200"
          >
            <CardContent className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-500 transition-colors duration-300">
                <Link href={`/articles/${article.id}`}>
                  {index + 1}. {article.title}
                </Link>
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Drafts;
