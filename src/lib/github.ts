import { Octokit } from '@octokit/rest';
import type { Repository, WorkflowRun } from '@/types/github';
import { formatDuration } from './utils';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  used: number;
}

export class RateLimitError extends Error {
  resetDate: Date;
  waitTime: number;

  constructor(resetDate: Date, waitTime: number) {
    const formattedDuration = formatDuration(waitTime / 1000);
    const message = `Rate limit exceeded. Please wait ${formattedDuration} until ${resetDate.toLocaleString()}`;
    super(message);
    this.name = 'RateLimitError';
    this.resetDate = resetDate;
    this.waitTime = waitTime;
  }
}

// Initialize Octokit with a personal access token
export const getOctokit = (token: string) => {
  return new Octokit({ auth: token });
};

// Helper function to check rate limit and wait if necessary
async function checkRateLimit(octokit: Octokit): Promise<RateLimitInfo> {
  const { data } = await octokit.request('GET /rate_limit');
  const { limit, remaining, reset, used } = data.rate;
  const resetDate = new Date(reset * 1000);

  if (remaining < 1) {
    const waitTime = resetDate.getTime() - Date.now();
    if (waitTime > 0) {
      throw new RateLimitError(resetDate, waitTime);
    }
  }

  return {
    limit,
    remaining,
    reset: resetDate,
    used
  };
}

// Function to fetch GitHub Actions workflows for a repository
export async function fetchWorkflows(
  token: string,
  owner: string,
  repo: string
) {
  const octokit = getOctokit(token);

  try {
    await checkRateLimit(octokit);
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
      owner,
      repo,
    });

    return response.data.workflows;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Error fetching workflows:', error);
    throw error;
  }
}

// Function to fetch recent workflow runs
export async function fetchWorkflowRuns(
  token: string,
  owner: string,
  repo: string,
  per_page = 10
): Promise<{ data: WorkflowRun[], rateLimit: RateLimitInfo }> {
  const octokit = getOctokit(token);

  try {
    const rateLimit = await checkRateLimit(octokit);
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
      owner,
      repo,
      per_page,
    });

    return {
      data: response.data.workflow_runs,
      rateLimit
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Error fetching workflow runs:', error);
    throw error;
  }
}

// Function to fetch all repositories for an organization
export async function fetchOrgRepos(
  token: string,
  org: string,
  per_page = 100
): Promise<{ data: Repository[], rateLimit: RateLimitInfo }> {
  const octokit = getOctokit(token);

  try {
    const rateLimit = await checkRateLimit(octokit);
    const response = await octokit.request('GET /orgs/{org}/repos', {
      org,
      per_page,
      sort: 'updated',
      direction: 'desc',
    });

    return {
      data: response.data,
      rateLimit
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Error fetching organization repositories:', error);
    throw error;
  }
}
