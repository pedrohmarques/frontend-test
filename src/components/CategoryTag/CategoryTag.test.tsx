import { render, screen } from '@testing-library/react';
import CategoryTag from './CategoryTag';
import type { Category } from '../../types/Category';

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
    "id": "a3979472-2f20-11ef-a347-325096b39f47",
    "name": "Technology",
    "createdAt": "2026-09-19T02:26:27.231Z",
    "updatedAt": "2026-09-19T02:26:27.352Z",
    "postId": "cc8a8c63-2f82-4745-8b6e-28f88ff73fdd",
    ...overrides
  });

describe('CategoryTag', () => {
  it('renders the category name', () => {
    render(<CategoryTag category={makeCategory()} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders a different name when the category changes', () => {
    render(<CategoryTag category={makeCategory({ name: 'Science' })} />);

    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
  });
});