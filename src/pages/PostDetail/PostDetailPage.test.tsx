import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePost } from '../../hooks/usePost';
import { usePosts } from '../../hooks/usePosts';
import { ApiError } from '../../lib/api';
import type { Post } from '../../types/Posts';
import PostDetailPage from './PostDetailPage';

vi.mock('../../hooks/usePost');
vi.mock('../../hooks/usePosts');

const author = {
  id: 'emily',
  name: 'Emily Davis',
  profilePicture: 'https://example.com/emily.png',
  createdAt: '2023-05-10T12:00:00Z',
  updatedAt: '2023-05-10T12:00:00Z',
};

function makePost(id: string, title: string): Post {
  return {
    id,
    title,
    content: 'First paragraph.\n\nSecond paragraph.',
    thumbnail_url: `https://example.com/${id}.jpg`,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    author,
    authorId: author.id,
    categories: [],
  };
}

const current = makePost('1', 'AI in Healthcare');
const others = ['2', '3', '4', '5'].map((id) => makePost(id, `Other post ${id}`));

function mockPost(state: Partial<ReturnType<typeof usePost>> = {}) {
  vi.mocked(usePost).mockReturnValue({ post: current, loading: false, error: null, ...state });
}

function renderPage(state?: unknown) {
  render(
    <MemoryRouter initialEntries={['/', { pathname: '/posts/1', state }]} initialIndex={1}>
      <Routes>
        <Route path="/" element={<h1>Post list</h1>} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

// The article itself, without the "Latest articles" cards below it
const article = () => screen.getByRole('heading', { level: 1 }).parentElement!;

beforeEach(() => {
  vi.clearAllMocks();
  mockPost();
  vi.mocked(usePosts).mockReturnValue({ posts: [current, ...others], loading: false, error: null, refetch: vi.fn() });
});

describe('PostDetailPage', () => {
  it('renders the article', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'AI in Healthcare' })).toBeInTheDocument();
    expect(within(article()).getByText('Emily Davis')).toBeInTheDocument();
    expect(within(article()).getByText('First paragraph.')).toBeInTheDocument();
    expect(within(article()).getByText('Second paragraph.')).toBeInTheDocument();
  });

  it('shows the date the post was published', () => {
    renderPage();

    expect(within(article()).getByText('Jan 20, 2024')).toBeInTheDocument();
  });

  it('loads the post from the URL id and reuses the post passed by the list', () => {
    renderPage({ post: current });

    expect(usePost).toHaveBeenCalledWith('1', current);
  });

  it('suggests up to three other posts', () => {
    renderPage();

    const latest = screen.getByRole('region', { name: 'Latest articles' });
    const titles = within(latest).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

    expect(titles).toEqual(['Other post 2', 'Other post 3', 'Other post 4']);
  });

  it('goes back to the previous page', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByRole('heading', { name: 'Post list' })).toBeInTheDocument();
  });

  it('shows a loading indicator', () => {
    mockPost({ post: null, loading: true });
    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the not found page for a post that does not exist', () => {
    mockPost({ post: null, error: new ApiError(404, 'post not found') });
    renderPage();

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('shows an error for any other failure', () => {
    mockPost({ post: null, error: new ApiError(500, 'Server error') });
    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });
});