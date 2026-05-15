import React from 'react';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from '@/pages/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LandingPage />
    </QueryClientProvider>
  );
}
