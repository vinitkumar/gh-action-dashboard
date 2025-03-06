// Default organization and repositories to display
export const DEFAULT_ORG = 'django-cms';

// GitHub API configuration
export const GITHUB_API_URL = 'https://api.github.com';

// GitHub Token from environment variable
export const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';

// Application configuration
export const APP_CONFIG = {
  title: 'GitHub Actions Dashboard',
  description: 'Monitor GitHub Actions workflows across your organization',
  theme: {
    primary: '#2563eb', // Blue
    secondary: '#10b981', // Green
    success: '#22c55e', // Green
    error: '#ef4444', // Red
    warning: '#f59e0b', // Amber
    info: '#3b82f6', // Blue
  },
  refreshInterval: 60000, // 1 minute
}; 