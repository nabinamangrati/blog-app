'use client'
import { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message); // Display error message (e.g., "Invalid email or password")
        setSuccessMessage('');
        return;
      }

      const data = await response.json();
      const accessToken = data.accessToken; // Assuming the token is returned under 'token' key
      const refreshToken = data.refreshToken;
      setSuccessMessage('Login successful!');

      // Store the token (you can use localStorage or sessionStorage depending on your needs)
      localStorage.setItem('authToken', accessToken);  // Storing token in localStorage
      localStorage.setItem('refreshToken', refreshToken);
      console.log("token form login", accessToken)

      // Optionally, redirect the user after successful login
      window.location.href = '/dashboard';  // Or use Next.js router to navigate

      setError('');
    } catch (error) {
      console.error(error);
      setError('Login failed. Please try again.');
      setSuccessMessage('');
      setFormData({
        email: '',
        password: '',
      });
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </label>
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
