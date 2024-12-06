'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDetail = ({ params }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    // Unwrapping the params and getting the id
    const fetchData = async () => {
      const { id: userId } = await params;  // Unwrap the params to get the id
      setId(userId);
      
      if (!userId) {
        setError("No article id provided");
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You need to log in to access the articles.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
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
        console.log("response",response.data);
        localStorage.setItem('authToken', response.data.accessToken);
        fetchData();
      } catch (error) {
        console.error(error); // Log errors for debugging
        setError("Your session has expired. Please log in again.");

    }
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError("Error fetching article");
      }
    };

    fetchData();
  }, [params]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1><strong>Name:</strong> {user.name}</h1>
      <p><strong>Email: </strong>{user.email}</p>
      <p><strong>Created on:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
    
    </div>
  );
};

export default UserDetail;
