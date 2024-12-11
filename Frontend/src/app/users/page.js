'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import axiosInstance from "../../services/apiReq";
import useAuthStore from '../../store/authStore'; // Import Zustand store
import useUserStore from '../../store/userStore';

const Page=()=>{
  const { clearAuth } = useAuthStore();
  const { setUser,user } = useUserStore();
  console.log(user,'user') //gives null

  const fetchUsers = async () => {
    const response = await axiosInstance.get("/users");
    return  response.data
  };

  const { data: users, error, isLoading, isError } = useQuery({
    queryKey: ['users'], // Unique key for the query
    queryFn: fetchUsers, // The query function
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setUser(data[0]);
      }
    },
  });
  console.log(users,'users')//gives the users data


  const handleLogout = () => {
    clearAuth(); // Clear the authentication state from Zustand store
    window.location.href = '/login';  // Redirect to login page
  }
    
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Users</h1>
<button onClick={handleLogout}>Logout</button>
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

