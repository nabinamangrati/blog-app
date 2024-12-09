// src/utils/reactQueryClient.js
'use client'
import { QueryClient } from '@tanstack/react-query';
import {  QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries up to 3 times
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
    },
  },
});

export default function Layout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

