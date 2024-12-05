'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';

const Dashboard = () => {

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
    window.location.href = '/login';  // Redirect to login page

    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link href="/articles">Articles</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
