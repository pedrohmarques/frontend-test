import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import FilterDropdown from './FilterDropdown';

const options = [
  { id: 'tech', name: 'Technology' },
  { id: 'health', name: 'Health' },
];

function setup(props: Partial<ComponentProps<typeof FilterDropdown>> = {}) {
  const onChange = vi.fn();
  const user = userEvent.setup();

  render(
    <>
      <FilterDropdown label="Category" options={options} selectedIds={[]} onChange={onChange} {...props} />
      <p>Outside</p>
    </>,
  );

  const trigger = () => screen.getByRole('button', { name: /^category/i });
  return { user, onChange, trigger };
}

describe('FilterDropdown', () => {
  it('starts closed and opens on click', async () => {
    const { user, trigger } = setup();

    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Technology' })).not.toBeInTheDocument();

    await user.click(trigger());

    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Technology' })).toBeInTheDocument();
  });

  it('adds and removes options from the selection', async () => {
    const { user, onChange, trigger } = setup({ selectedIds: ['tech'] });
    await user.click(trigger());

    await user.click(screen.getByRole('button', { name: 'Health' }));
    expect(onChange).toHaveBeenLastCalledWith(['tech', 'health']);

    await user.click(screen.getByRole('button', { name: 'Technology' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('shows the selected names and a button to clear them', async () => {
    const { user, onChange } = setup({ selectedIds: ['tech', 'health'] });

    expect(screen.getByRole('button', { name: 'Category: Technology, Health' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear category filter' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('closes with Escape and gives the focus back to the trigger', async () => {
    const { user, trigger } = setup();
    await user.click(trigger());

    await user.keyboard('{Escape}');

    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
  });

  it('closes when clicking outside', async () => {
    const { user, trigger } = setup();
    await user.click(trigger());

    await user.click(screen.getByText('Outside'));

    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });
});