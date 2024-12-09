'use client'
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/apiReq';

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

      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred.");
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
