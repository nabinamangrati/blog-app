'use client'
import { useEffect, useState } from "react";

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
      setError("Failed to fetch articles. Please try again later.");

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
{users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p> Name: {user.name}</p>
              <p>Email: {user.email}</p>            
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available. Or only logged in user can view the users list</p>  // Handle case when articles are empty
      )}

    </div>
  )
}
export default Page