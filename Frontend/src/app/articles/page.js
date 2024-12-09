'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import axiosInstance from "../../services/apiReq";

const Page=()=>{
  const [articles, setArticles]=useState([])
  const [error, setError] = useState(""); 
  const [newArticle,setNewArticle]=useState({title:'', description:'', body:''}) 

  const fetchArticles = async () => {

    try {
      const response = await axiosInstance.get("/articles");
      setArticles(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
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
  
    try {
      console.log("Starting axios POST request...");
  
      const response = await axiosInstance.post("/articles", {
        title: newArticle.title,
        description: newArticle.description,
        body: newArticle.body,
      });
  
      console.log("Response object:", response);
  
      if (response.status !== 201) { // Ensure that the article was created
        setError("Failed to add article. Please try again.");
        return;
      }
  
      console.log("Parsed response data:", response.data);
  
      // Optionally, fetch or update the article list
      fetchArticles();
  
      // Reset the input fields after successful submission
      setNewArticle({ title: '', description: '', body: '' });
    } catch (error) {
      console.error("Error occurred:", error); // Log errors for debugging
      setError("An error occurred. Please try again.");
    }
  };
  
  // const addArticle = async (event) => {
  //   event.preventDefault(); // Prevent form submission from reloading the page
  
    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //   setError("You need to log in to access the articles.");
    //   console.log("You need to log in to access the articles.");
    //   return;
    // }
  
    // try {
    //   console.log("Starting fetch request...");
  
    //   const response = await fetch('http://localhost:3000/articles', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       title: newArticle.title,
    //       description: newArticle.description,
    //       body: newArticle.body,
    //     }),
    //   });
  
    //   console.log("Response object:", response);
  
    //   if (!response.ok) {
    //     setError("Failed to add article. Please try again.");
    //     return;
    //   }
  
    //   const data = await response.json();
    //   console.log("Parsed response data:", data);
  
    //   // Add the new article to the list
    //   // setArticles((prevArticles) => {
    //   //   console.log("Previous articles:", prevArticles);
    //   //   console.log("New article:", data);
    //   //   // Make sure the new article is correctly added
    //   //   return [...prevArticles, data];
    //   // });
    //   fetchArticles();

  
    //   // Reset the input fields after successful submission
    //   setNewArticle({ title: '', description: '', body: '' });
    // } catch (error) {
    //   console.error("Error occurred:", error); // Log errors for debugging
    //   setError("An error occurred. Please try again.");
    // }
  // };

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