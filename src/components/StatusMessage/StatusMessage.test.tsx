import { render, screen } from '@testing-library/react';
import { SearchX } from 'lucide-react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import StatusMessage from './StatusMessage';

type Props = ComponentProps<typeof StatusMessage>;

function renderStatusMessage(props: Partial<Props> = {}) {
  return render(<StatusMessage icon={SearchX} title="No posts found" {...props} />);
}

describe('StatusMessage', () => {
  it('renders the title as an h2 by default', () => {
    renderStatusMessage();

    expect(screen.getByRole('heading', { level: 2, name: 'No posts found' })).toBeInTheDocument();
  });

  it('renders the title as an h1 when headingLevel is 1', () => {
    renderStatusMessage({ headingLevel: 1 });

    expect(screen.getByRole('heading', { level: 1, name: 'No posts found' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    renderStatusMessage({ description: 'Try a different search.' });

    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
  });

  it('renders no description paragraph when it is not provided', () => {
    const { container } = renderStatusMessage();

    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('renders the actions passed in', () => {
    renderStatusMessage({ actions: <button type="button">Clear filters</button> });

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('hides the decorative icon from screen readers', () => {
    const { container } = renderStatusMessage();

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});