'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import { DEFAULT_ORG, GITHUB_TOKEN } from '@/config';

export default function Home() {
  const [token, setToken] = useState<string>(GITHUB_TOKEN);
  const [org] = useState<string>(DEFAULT_ORG);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for saved token in localStorage as fallback
  useEffect(() => {
    // If no environment variable token is available, try localStorage
    if (!token) {
      const savedToken = localStorage.getItem('github_token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, [token]);
  
  const handleLogout = () => {
    localStorage.removeItem('github_token');
    setToken('');
  };
  
  // Simple form to input token if not found in environment variable
  const handleTokenSubmit = (newToken: string) => {
    localStorage.setItem('github_token', newToken);
    setToken(newToken);
  };
  
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!token ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              GitHub Token Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No token found in environment variable. Please enter your GitHub personal access token:
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const token = formData.get('token') as string;
              if (token) handleTokenSubmit(token);
            }}>
              <div className="mb-4">
                <input
                  name="token"
                  type="password"
                  placeholder="GitHub Personal Access Token"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Dashboard token={token} org={org} onLogout={handleLogout} />
      )}
    </main>
  );
}
