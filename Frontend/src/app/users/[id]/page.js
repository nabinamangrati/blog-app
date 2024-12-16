"use client";
import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../services/apiReq";
import useUserStore from "../../../store/userStore";

const UserDetail = ({ params }) => {
  const {user, setUser} = useUserStore();
  console.log(user,"user");
  const { id } = use(params); // Extract the user ID from params

  const fetchUserDetails = async (id) => {
    if (!id) {
      throw new Error("No user ID provided");
    }
    const response = await axiosInstance.get(`/users/${id}`);
    setUser(response.data);
    return response.data;
  };  

  // Use the `useQuery` hook to fetch user details
  const {
   
    error,  
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id], // Unique key for caching based on the user ID
    queryFn: () => fetchUserDetails(id), // Fetch function
    enabled: !!id, // Ensure the query only runs if an ID is provided
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message || "An error occurred."}</p>;
  }

  return (
    <div>
      <h1>
        <strong>Name:</strong> {user.name}
      </h1>
      <p>
        <strong>Email: </strong>
        {user.email}
      </p>
      <p>
        <strong>Created on:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(user.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default UserDetail;
