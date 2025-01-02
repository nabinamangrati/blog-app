'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Importing ShadCN button component

const Page = () => {
  return (
    <>
      {/* Full-page container with Flexbox for centering */}
      <div
        className="flex justify-center items-center h-screen text-center flex-col"
      >
        <h1 className="text-2xl font-bold mb-4">Welcome to Our Application</h1>

        {/* Register and Login Buttons with ShadCN styling */}
        <nav className="flex gap-6">
          <Link href="/register">
            <Button >
              Register
            </Button> 
          </Link>
          <Link href="/login">
            <Button >
              Login
            </Button> 
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Page;
