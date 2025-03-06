import React from 'react';
import Image from 'next/image';
import { WorkflowRun } from '@/types/github';
import { getStatusColor, getStatusIcon, timeAgo, truncateText } from '@/lib/utils';

interface WorkflowRunCardProps {
  workflowRun: WorkflowRun;
}

const WorkflowRunCard: React.FC<WorkflowRunCardProps> = ({ workflowRun }) => {
  const statusColor = getStatusColor(workflowRun.status, workflowRun.conclusion);
  const statusIcon = getStatusIcon(workflowRun.status, workflowRun.conclusion);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${statusColor}`}></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {workflowRun.name || 'Unnamed Workflow'}
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            #{workflowRun.run_number}
          </span>
        </div>
        
        {workflowRun.head_commit && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {truncateText(workflowRun.head_commit.message, 60)}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          {workflowRun.actor ? (
            <div className="flex items-center">
              <div className="relative w-5 h-5 mr-1">
                <Image 
                  src={workflowRun.actor.avatar_url} 
                  alt={workflowRun.actor.login}
                  className="rounded-full"
                  fill
                  sizes="20px"
                />
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                {workflowRun.actor.login}
              </span>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              System
            </div>
          )}
          <span className="text-gray-500 dark:text-gray-400">
            {timeAgo(workflowRun.updated_at)}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-1">{statusIcon}</span>
            <span className="text-sm capitalize">
              {workflowRun.conclusion || workflowRun.status}
            </span>
          </div>
          <a 
            href={workflowRun.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunCard; 