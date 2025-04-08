import { NextRequest, NextResponse } from 'next/server';
import { fetchOrgRepos, fetchWorkflowRuns, RateLimitError } from '@/lib/github';
import { DEFAULT_ORG } from '@/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Get pagination parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const reposPerPage = 10; // Hard limit: only process 10 repositories at a time

  // Always use the hardcoded organization
  const org = DEFAULT_ORG;

  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token is required. Please provide it in the Authorization header.' },
      { status: 401 }
    );
  }

  try {
    // Fetch all repositories for the organization first to get total count
    const { data: allRepos, rateLimit: reposRateLimit } = await fetchOrgRepos(token, org, 100);

    // Calculate pagination values
    const totalRepos = allRepos.length;
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    const startIndex = (page - 1) * reposPerPage;
    const endIndex = Math.min(startIndex + reposPerPage, totalRepos);

    // Get only the repositories for the current page
    const paginatedRepos = allRepos.slice(startIndex, endIndex);

    // Process only the repositories for the current page
    const results = [];
    let currentRateLimit = reposRateLimit;

    for (const repo of paginatedRepos) {
      try {
        const { data: runs, rateLimit } = await fetchWorkflowRuns(token, org, repo.name, 5);
        currentRateLimit = rateLimit; // Keep track of the most recent rate limit
        results.push({
          repository: repo,
          workflow_runs: runs,
        });
      } catch (error) {
        if (error instanceof RateLimitError) {
          return NextResponse.json(
            {
              error: error.message,
              rate_limit: {
                reset_at: error.resetDate,
                wait_time: error.waitTime
              }
            },
            { status: 429 }
          );
        }
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
      pagination: {
        page,
        total_pages: totalPages,
        total_repos: totalRepos,
        repos_per_page: reposPerPage,
      },
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
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: error.message,
          rate_limit: {
            reset_at: error.resetDate,
            wait_time: error.waitTime
          }
        },
        { status: 429 }
      );
    }
    console.error('Error fetching GitHub Actions data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub Actions data' },
      { status: 500 }
    );
  }
}
