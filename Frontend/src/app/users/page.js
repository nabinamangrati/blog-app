'use client'
import { useQuery } from '@tanstack/react-query';

import Link from 'next/link';
import axiosInstance from "../../services/apiReq";
import useAuthStore from '../../store/authStore';

const Page=()=>{
  const { authToken, clearAuth } = useAuthStore();

  const fetchUsers = async () => {
    const response = await axiosInstance.get("/users");
    return  response.data
  };

  const { data: users, error, isLoading, isError } = useQuery({
    queryKey: ['users'], // Unique key for the query
    queryFn: fetchUsers, // The query function
  });


  const handleLogout = () => {
    clearAuth(); // Clear the authentication state from Zustand store
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('refreshToken');
    window.location.href = '/login';  // Redirect to login page
  }
    
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => router.reload()}>Retry</button>
      </div>
    );
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

// src/pages/users/index.js
// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axiosInstance from "../../services/apiReq";
// import { useRouter } from 'next/router';
// import useAuthStore from '../../store/authStore'; // Import Zustand store

// const Page = () => {
//   const router = useRouter();
  
//   // Access the Zustand store to get the authentication state
//   const { authToken, clearAuth } = useAuthStore();

//   const fetchUsers = async () => {
//     const response = await axiosInstance.get("/users");
//     return response.data;
//   };

//   const { data: users, error, isLoading, isError } = useQuery({
//     queryKey: ['users'],
//     queryFn: fetchUsers,
//   });

//   const handleLogout = () => {
//     clearAuth(); // Clear the authentication state from Zustand store
//     router.push('/login'); // Redirect to login page
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return (
//       <div>
//         <p>Error: {error.message}</p>
//         <button onClick={() => router.reload()}>Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Users</h1>
//       <button onClick={handleLogout}>Logout</button>
//       <ul>
//         {users.map((user, index) => (
//           <li key={user.id}>
//             <p>
//               {index + 1}. Name: 
//               <Link href={`/users/${user.id}`}>{user.name}</Link>
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Page;
