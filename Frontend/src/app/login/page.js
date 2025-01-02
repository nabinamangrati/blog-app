'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      window.location.href = '/dashboard';  

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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please enter your credentials to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          {error &&   
          <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </p>}
          {successMessage && 
           <p className="text-green-500 bg-green-100 p-3 rounded-md text-sm">
            {successMessage}
            </p>}
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            
       <div className="mt-4">
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => setFormData({ email: '', password: '' })}>Cancel</Button>
          <Button type="submit">Login</Button>
        </CardFooter>
        </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
