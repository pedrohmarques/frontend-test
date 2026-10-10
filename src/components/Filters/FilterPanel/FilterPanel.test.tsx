import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FiltersProvider, useFilters, useFiltersDispatch } from '../../../features/filters';
import { useAuthors } from '../../../hooks/useAuthor';
import { useCategories } from '../../../hooks/useCategories';
import FilterPanel from './FilterPanel';

vi.mock('../../../hooks/useCategories');
vi.mock('../../../hooks/useAuthor');

function AppliedFilters() {
  const { categoryIds, authorIds } = useFilters();
  const dispatch = useFiltersDispatch();

  return (
    <>
      <output>{`applied: [${categoryIds}] [${authorIds}]`}</output>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
}

function setup() {
  const user = userEvent.setup();
  render(
    <FiltersProvider>
      <FilterPanel />
      <AppliedFilters />
    </FiltersProvider>,
  );
  // The sidebar is display:none below the desktop breakpoint, so include hidden elements
  const option = (name: string) => screen.getByRole('button', { name, hidden: true });
  return { user, option };
}

beforeEach(() => {
  vi.mocked(useCategories).mockReturnValue({
    categories: [{ id: 'tech', name: 'Technology', postId: '', createdAt: '', updatedAt: '' }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  vi.mocked(useAuthors).mockReturnValue({
    authors: [{ id: 'emily', name: 'Emily Davis', profilePicture: '', createdAt: '', updatedAt: '' }],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
});

describe('FilterPanel', () => {
  it('only applies the selection after "Apply filters"', async () => {
    const { user, option } = setup();

    await user.click(option('Technology'));
    await user.click(option('Emily Davis'));
    expect(screen.getByText('applied: [] []')).toBeInTheDocument();

    await user.click(option('Apply filters'));
    expect(screen.getByText('applied: [tech] [emily]')).toBeInTheDocument();
  });

  it('drops the draft when the filters are reset elsewhere', async () => {
    const { user, option } = setup();
    await user.click(option('Technology'));
    await user.click(option('Apply filters'));

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(option('Technology')).toHaveAttribute('aria-pressed', 'false');
  });
});