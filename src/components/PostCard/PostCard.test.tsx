import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { Post } from '../../types/Posts';
import PostCard from './PostCard';

// Data
function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-1',
    title: 'Tech Innovations in Healthcare',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail_url: 'https://example.com/thumb-1.jpg',
    authorId: 'author-1',
    createdAt: '2024-01-20T02:00:00.000Z',
    updatedAt: '2024-01-20T02:00:00.000Z',
    author: {
      id: 'author-1',
      name: 'Emily Davis',
      profilePicture: 'https://example.com/avatar.png',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    categories: [
      { id: 'cat-1', name: 'Technology', createdAt: '', updatedAt: '' },
      { id: 'cat-2', name: 'Health', createdAt: '', updatedAt: '' },
    ],
    ...overrides,
  } as Post;
}

function FakeDetailPage() {
  const location = useLocation();
  const state = location.state as { post?: Post } | null;
  return (
    <div>
      <h1>Detail page</h1>
      <p>Path: {location.pathname}</p>
      <p>State title: {state?.post?.title ?? 'none'}</p>
    </div>
  );
}

function renderPostCard(post: Post = makePost()) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<PostCard post={post} />} />
        <Route path="/posts/:id" element={<FakeDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PostCard', () => {
  it('shows the post title as a heading', () => {
    renderPostCard();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Tech Innovations in Healthcare' }),
    ).toBeInTheDocument();
  });

  it('shows the author name', () => {
    renderPostCard();

    expect(screen.getByText('Emily Davis')).toBeInTheDocument();
  });

  it('shows the creation date formatted in UTC', () => {
    renderPostCard();

    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument();
  });

  it('shows the post content as the excerpt', () => {
    renderPostCard();

    expect(screen.getByText(/lorem ipsum dolor sit amet/i)).toBeInTheDocument();
  });

  it('shows the thumbnail image', () => {
    renderPostCard();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/thumb-1.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('lists every category', () => {
    renderPostCard();

    const list = screen.getByRole('list', { name: 'Categories' });
    const items = within(list).getAllByRole('listitem');

    expect(items).toHaveLength(2);
    expect(within(list).getByText('Technology')).toBeInTheDocument();
    expect(within(list).getByText('Health')).toBeInTheDocument();
  });

  it('renders an empty category list when the post has no categories', () => {
    renderPostCard(makePost({ categories: [] }));

    const list = screen.getByRole('list', { name: 'Categories' });
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
  });

  it('links to the post detail page', () => {
    renderPostCard();

    expect(screen.getByRole('link')).toHaveAttribute('href', '/posts/post-1');
  });

  it('opens the detail page and passes the post in the router state', async () => {
    const user = userEvent.setup();
    renderPostCard();

    await user.click(screen.getByRole('link'));

    expect(screen.getByRole('heading', { name: 'Detail page' })).toBeInTheDocument();
    expect(screen.getByText('Path: /posts/post-1')).toBeInTheDocument();
    expect(screen.getByText('State title: Tech Innovations in Healthcare')).toBeInTheDocument();
  });
});