'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';

import axios from "axios";
const Page=()=>{
  const [users, setUsers]=useState([])
  const [error, setError] = useState("");  

  const fetchUsers = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You need to log in to access the articles.");
      console.log("You need to log in to access the articles.");
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data",response.data);
      setUsers(response.data)
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
   fetchUsers()
  },[])

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';  // Redirect to login page
  }

  return (
    <div>
      <h1>Users</h1>
<button onClick={handleLogout}>Logout</button>
  {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

        <ul>
          {users.map((user,index) => (
            <li key={user.id}>
              <p> {index + 1} Name: 
  <Link href={`/users/${user.id}`}>
    {user.name}
  </Link></p>
              
            </li>
          ))}
        </ul>
    
    </div>
  )
}
export default Page