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

interface PaginationInfo {
  page: number;
  total_pages: number;
  total_repos: number;
  repos_per_page: number;
}

interface CachedData {
  repositories: RepositoryData[];
  pagination: PaginationInfo;
  rateLimitInfo: string;
  timestamp: number;
  page: number;
}

// Cache expiration: 2 hours in milliseconds
const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

// Generate a cache key based on organization and page
const getCacheKey = (org: string, page: number) => `github-actions-data-${org}-page-${page}`;

const Dashboard: React.FC<DashboardProps> = ({ token, org, onLogout }) => {
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiPage, setApiPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
  const [usingCachedData, setUsingCachedData] = useState(false);

  const getCachedData = (page: number): CachedData | null => {
    try {
      const cacheKey = getCacheKey(org, page);
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as CachedData;
        const now = Date.now();

        // Check if cache is still valid (less than 2 hours old)
        if (now - parsedData.timestamp < CACHE_EXPIRATION) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }

    return null;
  };

  const setCachedData = (page: number, data: CachedData) => {
    try {
      const cacheKey = getCacheKey(org, page);
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const fetchData = async (page = 1, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setUsingCachedData(false);

    // Try to get data from cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = getCachedData(page);

      if (cachedData) {
        setRepositories(cachedData.repositories);
        setPagination(cachedData.pagination);
        setRateLimitInfo(cachedData.rateLimitInfo);
        setLastUpdated(new Date(cachedData.timestamp));
        setUsingCachedData(true);
        setLoading(false);
        return;
      }
    }

    try {
      const params = new URLSearchParams({
        org,
        page: page.toString()
      });

      const response = await fetch(`/api/github/actions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRepositories(data.repositories);
      setPagination(data.pagination);
      setRateLimitInfo(data._rate_limit_info);

      const now = Date.now();
      setLastUpdated(new Date(now));

      // Cache the response data
      if (data.pagination) {
        setCachedData(page, {
          repositories: data.repositories,
          pagination: data.pagination,
          rateLimitInfo: data._rate_limit_info,
          timestamp: now,
          page
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(apiPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, org, apiPage]);

  // Filter repositories by search term
  const filteredRepositories = repositories.filter(repo =>
    repo.repository.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Change API page
  const changePage = (newPage: number) => {
    setApiPage(newPage);
    window.scrollTo(0, 0);
  };

  // Format cache time in a human-readable way
  const formatCacheTime = (timestamp: number) => {
    const now = Date.now();
    const diffMinutes = Math.floor((now - timestamp) / (60 * 1000));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>
                  {usingCachedData ? (
                    <>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">Cached</span>
                      Data from {formatCacheTime(lastUpdated.getTime())}
                    </>
                  ) : (
                    <>Last updated: {lastUpdated.toLocaleTimeString()}</>
                  )}
                </p>
              </div>
            )}

            <button
              onClick={() => fetchData(apiPage, true)}
              disabled={loading}
              className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
              title="Refresh data from GitHub (bypasses cache)"
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

        {rateLimitInfo && (
          <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 p-3 rounded mb-4 text-sm">
            {rateLimitInfo}
            {usingCachedData && (
              <div className="mt-1 text-xs">
                Using cached data to avoid API rate limits. Data will refresh automatically after 2 hours.
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search repositories on this page..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {pagination && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Showing page {pagination.page} of {pagination.total_pages} ({pagination.total_repos} total repositories)
            </p>
          </div>
        )}

        {loading ? (
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
                {filteredRepositories.map((repo) => (
                  <RepositoryCard
                    key={repo.repository.id}
                    repository={repo.repository}
                    workflowRuns={repo.workflow_runs}
                  />
                ))}
              </div>
            )}

            {/* API Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8">
                <ul className="flex space-x-2">
                  <li>
                    <button
                      onClick={() => changePage(Math.max(1, apiPage - 1))}
                      disabled={apiPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                    .filter(num => {
                      // Show first, last, current, and pages around current
                      return num === 1 ||
                             num === pagination.total_pages ||
                             (num >= apiPage - 2 && num <= apiPage + 2);
                    })
                    .map((number, index, array) => (
                      <React.Fragment key={number}>
                        {index > 0 && array[index - 1] !== number - 1 && (
                          <li className="flex items-center px-2">...</li>
                        )}
                        <li>
                          <button
                            onClick={() => changePage(number)}
                            className={`px-3 py-1 rounded ${
                              apiPage === number
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {number}
                          </button>
                        </li>
                      </React.Fragment>
                    ))}
                  <li>
                    <button
                      onClick={() => changePage(Math.min(pagination.total_pages, apiPage + 1))}
                      disabled={apiPage === pagination.total_pages}
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
