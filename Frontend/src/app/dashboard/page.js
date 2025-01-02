// "use client";
// import React, { useEffect } from "react";
// import Link from "next/link";

// const Dashboard = () => {
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       window.location.href = "/login"; // Redirect to login page
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Welcome to the Dashboard</h1>
//       <nav>
//         <ul>
//           <li>
//             <Link href="/articles">Articles</Link>
//           </li>
//           <li>
//             <Link href="/users">Users</Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Dashboard;

"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming Button is a Shadcn component
import { Card } from "@/components/ui/card"; // Assuming Card is a Shadcn component
// import { Container } from "@/components/ui/container"; // Assuming Container is a Shadcn component

const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login"; // Redirect to login page
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to the Dashboard
        </h1>
        <nav className="text-center">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/articles"
                className="block w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="block w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;

