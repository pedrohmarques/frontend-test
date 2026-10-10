import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('announces the label to screen readers', () => {
    render(<Loading label="Loading posts..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading posts...');
  });

  it('shows the label on screen when showLabel is true', () => {
    render(<Loading label="Loading..." showLabel />);
    expect(screen.getByText('Loading...')).toBeVisible();
  });
});