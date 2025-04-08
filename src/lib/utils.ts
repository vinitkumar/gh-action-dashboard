// Format duration in seconds to a human-readable string
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.ceil(seconds)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

// Format date to a readable format
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Calculate time elapsed since a given date
export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'Never';
  }

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }

  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
}

// Get status color based on workflow status and conclusion
export function getStatusColor(status: string | null, conclusion: string | null): string {
  if (!status) {
    return 'bg-gray-500';
  }

  if (status === 'completed') {
    switch (conclusion) {
      case 'success':
        return 'bg-green-500';
      case 'failure':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-yellow-500';
      case 'skipped':
        return 'bg-gray-400';
      case 'timed_out':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  } else if (status === 'in_progress') {
    return 'bg-blue-500 animate-pulse';
  } else if (status === 'queued') {
    return 'bg-purple-500';
  }

  return 'bg-gray-500';
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Get status icon based on workflow status and conclusion
export function getStatusIcon(status: string | null, conclusion: string | null): string {
  if (!status) {
    return '❓';
  }

  if (status === 'completed') {
    switch (conclusion) {
      case 'success':
        return '✅';
      case 'failure':
        return '❌';
      case 'cancelled':
        return '⚠️';
      case 'skipped':
        return '⏭️';
      case 'timed_out':
        return '⏱️';
      default:
        return '❓';
    }
  } else if (status === 'in_progress') {
    return '🔄';
  } else if (status === 'queued') {
    return '⏳';
  }

  return '❓';
}
