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
    const { data: repos, rateLimit: reposRateLimit } = await fetchOrgRepos(token, org, per_page);
    
    // Process repositories sequentially to respect rate limits
    const results = [];
    let currentRateLimit = reposRateLimit;
    
    for (const repo of repos) {
      try {
        const { data: runs, rateLimit } = await fetchWorkflowRuns(token, org, repo.name, 5);
        currentRateLimit = rateLimit; // Keep track of the most recent rate limit
        results.push({
          repository: repo,
          workflow_runs: runs,
        });
      } catch (error) {
        console.error(`Error fetching workflow runs for ${repo.name}:`, error);
        results.push({
          repository: repo,
          workflow_runs: [],
          error: 'Failed to fetch workflow runs',
        });
      }
    }
    
    return NextResponse.json({
      organization: org,
      repositories: results,
      rate_limit: {
        limit: currentRateLimit.limit,
        remaining: currentRateLimit.remaining,
        reset: currentRateLimit.reset,
        used: currentRateLimit.used,
        enterprise_limit: currentRateLimit.limit === 15000,
      },
      _rate_limit_info: `Your token has a ${currentRateLimit.limit === 15000 ? 'GitHub Enterprise Cloud' : 'standard'} rate limit of ${currentRateLimit.limit} requests per hour. ${currentRateLimit.remaining} requests remaining, resets at ${currentRateLimit.reset.toLocaleString()}`
    });
  } catch (error) {
    console.error('Error fetching GitHub Actions data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub Actions data' },
      { status: 500 }
    );
  }
} 