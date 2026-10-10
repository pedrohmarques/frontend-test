import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FiltersProvider,
  initialFiltersState,
  useFilters,
  useFiltersDispatch,
  type FiltersState,
} from '../../features/filters';
import Search from './Search';

function Harness({ initialOpen, onOpenChange }: { initialOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const { search } = useFilters();
  const dispatch = useFiltersDispatch();
  const { pathname } = useLocation();

  return (
    <>
      <Search
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          onOpenChange(open);
        }}
      />
      <output>{`search: ${search}`}</output>
      <output>{`path: ${pathname}`}</output>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
}

function setup({ path = '/', open = true, filters = {} }: { path?: string; open?: boolean; filters?: Partial<FiltersState> } = {}) {
  const onOpenChange = vi.fn();
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  render(
    <MemoryRouter initialEntries={[path]}>
      <FiltersProvider initialState={{ ...initialFiltersState, ...filters }}>
        <Harness initialOpen={open} onOpenChange={onOpenChange} />
      </FiltersProvider>
    </MemoryRouter>,
  );

  return { user, onOpenChange, input: () => screen.getByRole('searchbox', { name: 'Search posts' }) };
}

const flushDebounce = () => act(() => vi.advanceTimersByTime(300));

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

describe('Search', () => {
  it('applies the search only after the user stops typing', async () => {
    const { user, input } = setup();

    await user.type(input(), 'health');
    expect(screen.getByText('search:')).toBeInTheDocument();

    flushDebounce();
    expect(screen.getByText('search: health')).toBeInTheDocument();
  });

  it('applies right away on Enter', async () => {
    const { user, input } = setup();

    await user.type(input(), 'cloud{Enter}');

    expect(screen.getByText('search: cloud')).toBeInTheDocument();
  });

  it('clears the field and the filter', async () => {
    const { user, input } = setup();
    await user.type(input(), 'health');
    flushDebounce();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input()).toHaveValue('');
    expect(input()).toHaveFocus();
    expect(screen.getByText('search:')).toBeInTheDocument();
  });

  it('empties the field when filters are reset elsewhere', async () => {
    const { user, input } = setup();
    await user.type(input(), 'health');
    flushDebounce();

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(input()).toHaveValue('');
  });

  it('clears on the first Escape and closes on the second', async () => {
    const { user, input, onOpenChange } = setup();
    await user.type(input(), 'health');

    await user.keyboard('{Escape}');
    expect(input()).toHaveValue('');
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('focuses the field when opened on mobile', async () => {
    const { user, input } = setup({ open: false });

    await user.click(screen.getByRole('button', { name: 'Open search' }));

    expect(input()).toHaveFocus();
  });

  it('goes to the list when typing on a post page', async () => {
    const { user, input } = setup({ path: '/posts/1' });

    await user.type(input(), 'h');

    expect(screen.getByText('path: /')).toBeInTheDocument();
  });

  it('does not leave a post page just because a search is active', () => {
    setup({ path: '/posts/1', filters: { search: 'health' } });

    flushDebounce();

    expect(screen.getByText('path: /posts/1')).toBeInTheDocument();
  });
});