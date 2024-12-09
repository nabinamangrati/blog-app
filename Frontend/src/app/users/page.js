'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import axiosInstance from "../../services/apiReq";

const Page=()=>{
  const [users, setUsers]=useState([])
  const [error, setError] = useState("");  

  const fetchUsers = async () => {

    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
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