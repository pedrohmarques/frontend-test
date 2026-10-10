import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FiltersProvider } from '../../../features/filters';
import Sort from './Sort';

function renderSort() {
  return render(
    <FiltersProvider>
      <Sort />
    </FiltersProvider>,
  );
}

describe('Sort', () => {
  it('starts with newest first', () => {
    renderSort();

    expect(screen.getByRole('button', { name: /sort by/i })).toHaveTextContent('Newest first');
  });

  it('toggles between newest and oldest on each click', async () => {
    const user = userEvent.setup();
    renderSort();
    const button = screen.getByRole('button', { name: /sort by/i });

    await user.click(button);
    expect(button).toHaveTextContent('Oldest first');

    await user.click(button);
    expect(button).toHaveTextContent('Newest first');
  });

  it('tells screen readers what the next click does', () => {
    renderSort();

    expect(screen.getByRole('button', { name: /sort by/i })).toHaveAccessibleName(
      'Sort by: Newest first. Change to oldest first',
    );
  });
});