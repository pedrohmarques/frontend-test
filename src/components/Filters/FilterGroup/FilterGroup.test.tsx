import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import FilterGroup, { type FilterOption } from './FilterGroup';

type Props = ComponentProps<typeof FilterGroup>;

const OPTIONS: FilterOption[] = [
  { id: 'cat-1', name: 'Technology' },
  { id: 'cat-2', name: 'Science' },
  { id: 'cat-3', name: 'Health' },
];

function renderFilterGroup(props: Partial<Props> = {}) {
  const onToggle = vi.fn();
  const utils = render(
    <FilterGroup label="Category" options={OPTIONS} selectedIds={[]} onToggle={onToggle} {...props} />,
  );
  return { ...utils, onToggle };
}

describe('FilterGroup', () => {
  describe('labelling', () => {
    it('names the group after the label, so screen readers announce it', () => {
      renderFilterGroup();

      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    });

    it('shows the label as a heading when showTitle is true', () => {
      renderFilterGroup({ showTitle: true });

      expect(screen.getByRole('heading', { level: 3, name: 'Category' })).toBeInTheDocument();
    });

    it('keeps the group name even when the title is visually hidden', () => {
      renderFilterGroup({ showTitle: false });

      // The heading stays in the DOM (visually hidden), so the group keeps its name
      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    });

    it('gives each group a unique id, so two groups on the page do not clash', () => {
      render(
        <>
          <FilterGroup label="Category" options={OPTIONS} selectedIds={[]} onToggle={vi.fn()} />
          <FilterGroup label="Author" options={[]} selectedIds={[]} onToggle={vi.fn()} />
        </>,
      );

      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Author' })).toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('renders one list item per option', () => {
      renderFilterGroup();

      const group = screen.getByRole('group', { name: 'Category' });
      expect(within(group).getAllByRole('listitem')).toHaveLength(3);
      expect(within(group).getByRole('button', { name: 'Technology' })).toBeInTheDocument();
      expect(within(group).getByRole('button', { name: 'Science' })).toBeInTheDocument();
      expect(within(group).getByRole('button', { name: 'Health' })).toBeInTheDocument();
    });

    it('marks only the selected options as pressed', () => {
      renderFilterGroup({ selectedIds: ['cat-2'] });

      expect(screen.getByRole('button', { name: 'Science' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Technology' })).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByRole('button', { name: 'Health' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('supports several selected options at once', () => {
      renderFilterGroup({ selectedIds: ['cat-1', 'cat-3'] });

      expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(2);
    });

    it('calls onToggle with the id of the clicked option', async () => {
      const user = userEvent.setup();
      const { onToggle } = renderFilterGroup();

      await user.click(screen.getByRole('button', { name: 'Health' }));

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith('cat-3');
    });

    it('renders an empty list when there are no options', () => {
      renderFilterGroup({ options: [] });

      const group = screen.getByRole('group', { name: 'Category' });
      expect(within(group).queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  describe('loading and error states', () => {
    it('shows a loading message instead of the list while loading', () => {
      renderFilterGroup({ loading: true });

      expect(screen.getByRole('status')).toHaveTextContent('Loading category options...');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('shows an error message instead of the list when loading failed', () => {
      renderFilterGroup({ error: true });

      expect(screen.getByText('Could not load the options.')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('shows only the loading state when loading and error are both true', () => {
      renderFilterGroup({ loading: true, error: true });

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('Could not load the options.')).not.toBeInTheDocument();
    });
  });
});