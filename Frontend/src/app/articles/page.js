'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
// import { apiRequest } from "../../services/apiReq";

import axios from "axios";
const Page=()=>{
  const [articles, setArticles]=useState([])
  const [error, setError] = useState(""); 
  const [newArticle,setNewArticle]=useState({title:'', description:'', body:''}) 

  const fetchArticles = async () => {
    // await apiRequest('http://localhost:3000/articles', setError, setArticles, fetchArticles);


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

  const addArticle = async (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You need to log in to access the articles.");
      console.log("You need to log in to access the articles.");
      return;
    }
  
    try {
      console.log("Starting fetch request...");
  
      const response = await fetch('http://localhost:3000/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newArticle.title,
          description: newArticle.description,
          body: newArticle.body,
        }),
      });
  
      console.log("Response object:", response);
  
      if (!response.ok) {
        setError("Failed to add article. Please try again.");
        return;
      }
  
      const data = await response.json();
      console.log("Parsed response data:", data);
  
      // Add the new article to the list
      // setArticles((prevArticles) => {
      //   console.log("Previous articles:", prevArticles);
      //   console.log("New article:", data);
      //   // Make sure the new article is correctly added
      //   return [...prevArticles, data];
      // });
      fetchArticles();

  
      // Reset the input fields after successful submission
      setNewArticle({ title: '', description: '', body: '' });
    } catch (error) {
      console.error("Error occurred:", error); // Log errors for debugging
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Articles</h1>
<button onClick={handleLogout}>Logout</button>
{error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
<h2>add articles</h2>
<form onSubmit={addArticle}>
Title:
  <input 
  type="text" 
  value={newArticle.title}
  onChange={(e)=>setNewArticle({...newArticle, title: e.target.value})}
required
  />
 <br></br>

  Description:
  <input 
  type="text"
  value={newArticle.description}
  onChange={(e)=>setNewArticle({...newArticle, description: e.target.value})}/>
<br></br>
Body:
<input type="text"
value={newArticle.body}
onChange={(e)=>setNewArticle({...newArticle, body:e.target.value})}/> <br></br>
<button type="submit">add article</button>
</form>
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