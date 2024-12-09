'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axiosInstance from '../../../services/apiReq';

const Drafts=()=>{

    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
const fetchDrafts=async()=>{

  try {
    const response = await axiosInstance.get("/articles/drafts");
    setArticles(response.data);
  } catch (error) {
    setError(error.response?.data?.message || "An error occurred.");
  }
}
useEffect(() => {
    fetchDrafts();
    }, []);

    return (
        <>
       <h2>Drafts</h2>
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
        </>
    )
}

export default Drafts