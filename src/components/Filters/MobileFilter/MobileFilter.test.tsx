import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FiltersProvider, useFilters } from '../../../features/filters';
import { useAuthors } from '../../../hooks/useAuthor';
import { useCategories } from '../../../hooks/useCategories';
import MobileFilter from './MobileFilter';

vi.mock('../../../hooks/useCategories');
vi.mock('../../../hooks/useAuthor');

function AppliedCategories() {
  const { categoryIds } = useFilters();
  return <output>{`applied: [${categoryIds}]`}</output>;
}

beforeEach(() => {
  vi.mocked(useCategories).mockReturnValue({
    categories: [{ id: 'tech', name: 'Technology', postId: '', createdAt: '', updatedAt: '' }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  vi.mocked(useAuthors).mockReturnValue({ authors: [], loading: false, error: null, refetch: vi.fn() });
});

describe('MobileFilter', () => {
  it('applies a category as soon as it is picked', async () => {
    const user = userEvent.setup();
    render(
      <FiltersProvider>
        <MobileFilter />
        <AppliedCategories />
      </FiltersProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Category', hidden: true }));
    await user.click(screen.getByRole('button', { name: 'Technology', hidden: true }));

    expect(screen.getByText('applied: [tech]')).toBeInTheDocument();
  });
});