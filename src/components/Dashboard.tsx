import React, { useState, useEffect } from 'react';
import { Repository, WorkflowRun } from '@/types/github';
import RepositoryCard from './RepositoryCard';
import Footer from './Footer';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 20;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        token,
        org,
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

  // Filter repositories by search term
  const filteredRepositories = repositories.filter(repo =>
    repo.repository.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepositories.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(filteredRepositories.length / reposPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Django CMS GitHub Actions Dashboard
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

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredRepositories.length > 0 ? indexOfFirstRepo + 1 : 0} - {Math.min(indexOfLastRepo, filteredRepositories.length)} of {filteredRepositories.length} repositories
          </p>
        </div>

        {loading && repositories.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredRepositories.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {searchTerm ? 'No repositories match your search' : 'No repositories found for this organization'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentRepos.map((repo) => (
                  <RepositoryCard
                    key={repo.repository.id}
                    repository={repo.repository}
                    workflowRuns={repo.workflow_runs}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <ul className="flex space-x-2">
                  <li>
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded ${
                          currentPage === number
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
