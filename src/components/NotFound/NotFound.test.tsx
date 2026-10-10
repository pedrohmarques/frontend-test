import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NotFound from './NotFound';

function renderNotFound(props: Parameters<typeof NotFound >[0] = {}) {
  return render(
    <MemoryRouter initialEntries={['/this-page-does-not-exist']}>
      <Routes>
        <Route path="/" element={<h1>Home page</h1>} />
        <Route path="*" element={<NotFound {...props} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('NotFoundPage', () => {
  it('shows the default title as the page heading (h1)', () => {
    renderNotFound();

    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByText(/does not exist or was moved/i)).toBeInTheDocument();
  });

  it('accepts a custom title and description', () => {
    renderNotFound({
      title: 'Post not found',
      description: 'This article may have been removed.',
    });

    expect(screen.getByRole('heading', { name: /post not found/i })).toBeInTheDocument();
    expect(screen.getByText(/may have been removed/i)).toBeInTheDocument();
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
  });

  it('has a link back to the blog home', () => {
    renderNotFound();

    expect(screen.getByRole('link', { name: /back to the blog/i })).toHaveAttribute('href', '/');
  });

  it('navigates to the home page when the link is clicked', async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.click(screen.getByRole('link', { name: /back to the blog/i }));

    expect(screen.getByRole('heading', { name: /home page/i })).toBeInTheDocument();
  });
});