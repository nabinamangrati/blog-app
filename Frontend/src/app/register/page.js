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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '' 
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users', { // The URL matches the @Post('users') route in your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          const data = await response.json();
          setError(data.message); // Display the error message returned by backend (e.g. "Email already exits")
        } else {
          throw new Error('Registration failed');
        }
        setSuccessMessage('');
        return;
      }

      const data = await response.json();
      setSuccessMessage('Registration successful! Please log in.');
      window.location.href = '/login';  
      setError('');
    } catch (error) {
      console.error(error);
      setError('Registration failed. Please try again.');
      setSuccessMessage('');
      setFormData('')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
     <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account by entering your details below.</CardDescription>
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
        <Label>
          Name:
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Label>
        </div>
        <div className="flex flex-col space-y-1.5">
        <Label>
          Email:
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </Label>
        </div>
        <div className="flex flex-col space-y-1.5">
        <Label>
          Password:
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </Label>
      
        </div>
        <div className="flex flex-col space-y-1.5">
        <Label>
          Confirm Password:
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </Label>
        </div>
        </div>
        <div className="mt-4">
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() =>  setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })}>Cancel</Button>
          <Button type="submit">Register</Button>
        </CardFooter>
        </div>
      </form>
      </CardContent>
      </Card>
    </div>
    
  );

};

export default RegisterPage;
