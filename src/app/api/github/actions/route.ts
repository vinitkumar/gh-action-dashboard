import { NextRequest, NextResponse } from 'next/server';
import { fetchOrgRepos, fetchWorkflowRuns } from '@/lib/github';
import { DEFAULT_ORG } from '@/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  // Always use the hardcoded organization
  const org = DEFAULT_ORG;
  // Fetch all repos instead of limiting them
  const per_page = 100; // Maximum allowed by GitHub API
  
  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token is required' },
      { status: 400 }
    );
  }
  
  try {
    // Fetch all repositories for the organization
    const repos = await fetchOrgRepos(token, org, per_page);
    
    // Fetch workflow runs for each repository
    const workflowRunsPromises = repos.map(async (repo) => {
      try {
        const runs = await fetchWorkflowRuns(token, org, repo.name, 5);
        return {
          repository: repo,
          workflow_runs: runs,
        };
      } catch (error) {
        console.error(`Error fetching workflow runs for ${repo.name}:`, error);
        return {
          repository: repo,
          workflow_runs: [],
          error: 'Failed to fetch workflow runs',
        };
      }
    });
    
    const results = await Promise.all(workflowRunsPromises);
    
    return NextResponse.json({
      organization: org,
      repositories: results,
    });
  } catch (error) {
    console.error('Error fetching GitHub Actions data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub Actions data' },
      { status: 500 }
    );
  }
} 