'use client'
import { useEffect, useState } from "react";
import axios from "axios";
// import { useRouter } from 'next/router';  // Import useRouter for redirection


const Page=()=>{
  const [articles, setArticles]=useState([])
  const [error, setError] = useState("");  
  // const router = useRouter();  // Initialize the useRouter hook

  const fetchArticles = async () => {
    const token = localStorage.getItem('authToken');
    console.log("token",token);
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
      setError("Failed to fetch articles. Please try again later.");

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
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
           <p> Title: {article.title}</p>
           <p>Description: {article.description}</p>
           <p>Author:  {article.author}</p>
            </li> 
        ))}
      </ul>

    </div>
  )
}
export default Page