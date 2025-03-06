# GitHub Actions Dashboard for django-cms

A modern dashboard to monitor GitHub Actions workflows across the django-cms organization's repositories.

## Features

- View GitHub Actions workflow runs for ALL repositories in the django-cms organization
- Search and filter repositories by name
- Paginated view for easy navigation through many repositories
- Real-time status updates with auto-refresh
- Secure authentication using GitHub personal access tokens (stored in environment variables)
- Responsive design for desktop and mobile
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- GitHub Personal Access Token with appropriate permissions

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gh-action-dashboard.git
cd gh-action-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your GitHub token in `.env.local`:

```
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Token

To use this dashboard, you'll need a GitHub personal access token with the following scopes:
- `repo` (for private repositories)
- `workflow` (for GitHub Actions access)

You can create a token at [GitHub Developer Settings](https://github.com/settings/tokens).

## Configuration

The dashboard is configured to display GitHub Actions data for the django-cms organization by default. This is hardcoded in the application.

## Usage

- **Search**: Use the search box to filter repositories by name
- **Pagination**: Navigate through pages of repositories using the pagination controls
- **Auto-refresh**: Toggle automatic data refresh (every 60 seconds by default)
- **Manual refresh**: Click the refresh button to update data immediately

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fgh-action-dashboard)

Make sure to add the `NEXT_PUBLIC_GITHUB_TOKEN` environment variable in your deployment settings.

## Security

- GitHub tokens are stored in environment variables or the browser's localStorage as a fallback
- API requests are made directly from the client to GitHub's API using your token

## License

This project is licensed under the MIT License - see the LICENSE file for details.
