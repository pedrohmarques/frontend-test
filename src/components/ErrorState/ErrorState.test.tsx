import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';
import { ApiError } from '../../lib/api';

describe('ErrorState', () => {
  it('is announced to screen readers as an alert', () => {
    render(<ErrorState />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows a generic message for server errors', () => {
    render(<ErrorState error={new ApiError(500, 'Internal Server Error')} />);

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/could not load this content/i)).toBeInTheDocument();
  });

  it('shows an offline message for network errors', () => {
    render(<ErrorState error={new ApiError(0, 'Network error')} />);

    expect(screen.getByRole('heading', { name: /you seem to be offline/i })).toBeInTheDocument();
    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('treats unknown errors as generic errors', () => {
    render(<ErrorState error={new Error('boom')} />);

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
  });

  it('calls onRetry when the user clicks "Try again"', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState error={new ApiError(500, 'Error')} onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show the retry button without onRetry', () => {
    render(<ErrorState error={new ApiError(500, 'Error')} />);

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('uses the heading level passed in', () => {
    render(<ErrorState headingLevel={1} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});