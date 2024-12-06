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
        localStorage.removeItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if(!refreshToken){
          setError("Your session has expired. Please log in again.");
          return;
        }
        try {
          const response = await axios.post('http://localhost:3000/auth/refresh-token', {
            refreshToken,
          });
          // console.log("response",response.data);
          localStorage.setItem('authToken', response.data.accessToken);
          fetchArticles();
        } catch (error) {
          console.error(error); // Log errors for debugging
          setError("Your session has expired. Please log in again.");
  
      }

    }
  }
}

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
{error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <ul>
          {articles.map((article, index) => (
            <li key={article.id}>
             

              <p> {index + 1} Title: 
  <Link href={`/articles/${article.id}`}>
    {article.title}
  </Link></p>
            </li>
          ))}
        </ul>
    </div>
  )
}
export default Page