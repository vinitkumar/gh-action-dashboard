import React from 'react';
import Image from 'next/image';
import { Repository, WorkflowRun } from '@/types/github';
import WorkflowRunCard from './WorkflowRunCard';
import { timeAgo, truncateText } from '@/lib/utils';

interface RepositoryCardProps {
  repository: Repository;
  workflowRuns: WorkflowRun[];
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, workflowRuns }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-2">
              <Image 
                src={repository.owner.avatar_url} 
                alt={repository.owner.login}
                className="rounded-full"
                fill
                sizes="32px"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {repository.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {repository.owner.login}
              </p>
            </div>
          </div>
          <a 
            href={repository.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View Repository
          </a>
        </div>
        
        {repository.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {truncateText(repository.description, 100)}
          </p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Last updated: {timeAgo(repository.updated_at)}
        </p>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Recent Workflow Runs
        </h3>
        
        {workflowRuns.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workflowRuns.map((run) => (
              <WorkflowRunCard key={run.id} workflowRun={run} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent workflow runs found
          </p>
        )}
      </div>
    </div>
  );
};

export default RepositoryCard; 