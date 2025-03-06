import React, { useState, useEffect } from 'react';
import { Repository, WorkflowRun } from '@/types/github';
import RepositoryCard from './RepositoryCard';
import { APP_CONFIG } from '@/config';

interface DashboardProps {
  token: string;
  org: string;
  onLogout: () => void;
}

interface RepositoryData {
  repository: Repository;
  workflow_runs: WorkflowRun[];
}

const Dashboard: React.FC<DashboardProps> = ({ token, org, onLogout }) => {
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        token,
        org,
        limit: '10',
      });
      
      const response = await fetch(`/api/github/actions?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setRepositories(data.repositories);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, org]);
  
  // Auto-refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchData();
      }, APP_CONFIG.refreshInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, token, org]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            GitHub Actions Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organization: <span className="font-semibold">{org}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          
          <div className="flex items-center">
            <label htmlFor="autoRefresh" className="mr-2 text-sm text-gray-600 dark:text-gray-300">
              Auto-refresh
            </label>
            <input
              id="autoRefresh"
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
            title="Refresh data"
          >
            🔄
          </button>
          
          <button
            onClick={onLogout}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm"
          >
            Change Token
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading && repositories.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {repositories.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No repositories found for this organization.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {repositories.map((repo) => (
                <RepositoryCard
                  key={repo.repository.id}
                  repository={repo.repository}
                  workflowRuns={repo.workflow_runs}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 