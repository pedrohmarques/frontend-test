import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import FilterItem from './FilterItem';

type Props = ComponentProps<typeof FilterItem>;

function renderFilterItem(props: Partial<Props> = {}) {
  const onToggle = vi.fn();
  const utils = render(
    <FilterItem id="cat-1" label="Technology" selected={false} onToggle={onToggle} {...props} />,
  );
  return { ...utils, onToggle };
}

describe('FilterItem', () => {
  it('renders the label as a button', () => {
    renderFilterItem();

    expect(screen.getByRole('button', { name: 'Technology' })).toBeInTheDocument();
  });

  it('is announced as not pressed when not selected', () => {
    renderFilterItem({ selected: false });

    expect(screen.getByRole('button', { name: 'Technology' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('is announced as pressed when selected', () => {
    renderFilterItem({ selected: true });

    expect(screen.getByRole('button', { name: 'Technology' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the check icon only when selected', () => {
    const { container, rerender, onToggle } = renderFilterItem({ selected: false });
    expect(container.querySelector('svg')).not.toBeInTheDocument();

    rerender(<FilterItem id="cat-1" label="Technology" selected onToggle={onToggle} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('keeps the check icon hidden from screen readers', () => {
    const { container } = renderFilterItem({ selected: true });

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onToggle with its id when clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderFilterItem();

    await user.click(screen.getByRole('button', { name: 'Technology' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('cat-1');
  });

  it('can be toggled with the keyboard (Enter and Space)', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderFilterItem();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Technology' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});