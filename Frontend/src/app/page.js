'use client'
import { useEffect, useState } from "react";
import axios from "axios";

const Page=()=>{
  const [posts, setPosts]=useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/posts')
    .then((res)=>{
      setPosts(res.data)
    })
  },[])

  return (
    <div>
     
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
           <p> Title: {post.title}</p>
           <p>Content: {post.content}</p>
           <p>Author:  {post.author}</p>
            </li> 
        ))}
      </ul>

    </div>
  )
}
export default Page