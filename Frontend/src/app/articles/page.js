'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';

import axios from "axios";
const Page=()=>{
  const [articles, setArticles]=useState([])
  const [error, setError] = useState("");  

  const fetchArticles = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You need to log in to access the articles.");
      console.log("You need to log in to access the articles.");
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:3000/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data",response.data);
      setArticles(response.data)

      
    } catch (error) {
      console.error(error); // Log errors for debugging
      
      if (error.response && error.response.status === 401) {
        // Token expired, set error message
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to fetch articles. Please try again later.");
      }

    }
  };

  useEffect(()=>{
   fetchArticles()
  },[])

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';  // Redirect to login page
  }

  return (
    <div>
      <h1>Articles</h1>
<button onClick={handleLogout}>Logout</button>
{articles.length > 0 ? (
        <ul>
          {articles.map((article, index) => (
            <li key={article.id}>
              <p> {index + 1} Title: {article.title}</p>
              <Link href={`/articles/${article.id}`}>
                Read more
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available. Or only logged in user can view the articles</p>  // Handle case when articles are empty
      )}

    </div>
  )
}
export default Page