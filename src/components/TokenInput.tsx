import React, { useState } from 'react';

interface TokenInputProps {
  onTokenSubmit: (token: string, org: string) => void;
  isLoading: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit, isLoading }) => {
  const [token, setToken] = useState('');
  const [org, setOrg] = useState('');
  const [showToken, setShowToken] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim(), org.trim());
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        GitHub Authentication
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Enter your GitHub personal access token to view Actions data. Your token needs
        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm mx-1">
          repo
        </code>
        and
        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm mx-1">
          workflow
        </code>
        scopes.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="token" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            GitHub Token
          </label>
          <div className="relative">
            <input
              id="token"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Your token is stored locally and never sent to our servers.
          </p>
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="org" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Organization (optional)
          </label>
          <input
            id="org"
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="github-organization"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !token.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Loading...' : 'View Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default TokenInput; 