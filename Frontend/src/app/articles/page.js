"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import axiosInstance from "../../services/apiReq";
import useAuthStore from "../../store/authStore";
import useArticleStore from "../../store/articleStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { clearAuth } = useAuthStore();
  const { articles, setArticles } = useArticleStore();

  // Fetch articles function
  const fetchArticles = async () => {
    const response = await axiosInstance.get("/articles");
    setArticles(response.data);
    return response.data;
  };

  // Using TanStack Query to fetch the articles
  const { error, isLoading, isError } = useQuery({
    queryKey: ["articles"], // Unique key for the query
    queryFn: fetchArticles, // The query function
    //onSuccess cant be used in tanstack version 5 so it is removed
  });

  // Handle logout
  const handleLogout = () => {
    clearAuth(); // Clear the authentication state from Zustand store
    window.location.href = "/login"; // Redirect to login page
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
 
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black-200">Articles</h1>

   
      <div className="flex gap-4">
        <Button onClick={handleLogout}> Logout</Button>
        <Button>
          <Link href="/add-article">Create new article</Link>
        </Button>
      </div>

  
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

export default Page;
