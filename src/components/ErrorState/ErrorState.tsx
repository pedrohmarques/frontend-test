import { RefreshCw, TriangleAlert, WifiOff } from 'lucide-react';
import { ApiError } from '../../lib/api';
import StatusMessage from '../StatusMessage/StatusMessage';

interface ErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
  headingLevel?: 1 | 2;
}

function getErrorContent(error: unknown) {
  if (error instanceof ApiError && error.status === 0) {
    return {
      icon: WifiOff,
      title: 'You seem to be offline',
      description: 'Check your internet connection and try again.',
    };
  }

  return {
    icon: TriangleAlert,
    title: 'Something went wrong',
    description: 'We could not load this content. Please try again in a moment.',
  };
}

export function ErrorState({ error, onRetry, headingLevel = 2 }: ErrorStateProps) {
  const { icon, title, description } = getErrorContent(error);
  return (
    <div role="alert">
      <StatusMessage
        variant="error"
        icon={icon}
        title={title}
        description={description}
        headingLevel={headingLevel}
        actions={
          onRetry && (
            <button
              type="button"
              className="button secondary"
              onClick={onRetry}
            >
              <RefreshCw size={18} aria-hidden="true" />
              Try again
            </button>
          )
        }
      />
    </div>
  );
}