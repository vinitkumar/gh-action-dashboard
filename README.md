# GitHub Actions Dashboard

A modern dashboard to monitor GitHub Actions workflows across your organization's repositories.

## Features

- View GitHub Actions workflow runs for repositories in your organization
- Real-time status updates with auto-refresh
- Secure authentication using GitHub personal access tokens (stored locally)
- Responsive design for desktop and mobile
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

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

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Token

To use this dashboard, you'll need a GitHub personal access token with the following scopes:
- `repo` (for private repositories)
- `workflow` (for GitHub Actions access)

You can create a token at [GitHub Developer Settings](https://github.com/settings/tokens).

## Environment Variables

You can set the following environment variables in a `.env.local` file:

```
NEXT_PUBLIC_GITHUB_ORG=your-organization-name
```

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fgh-action-dashboard)

## Security

- GitHub tokens are stored only in the browser's localStorage and are never sent to any server other than GitHub's API
- API requests are made directly from the client to GitHub's API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
