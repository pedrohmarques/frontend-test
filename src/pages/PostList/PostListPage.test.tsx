import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FiltersProvider, initialFiltersState, type FiltersState } from '../../features/filters';
import { useAuthors } from '../../hooks/useAuthor';
import { useCategories } from '../../hooks/useCategories';
import { usePosts } from '../../hooks/usePosts';
import { ApiError } from '../../lib/api';
import type { Post } from '../../types/Posts';
import PostListPage from './PostListPage';

vi.mock('../../hooks/usePosts');
vi.mock('../../hooks/useCategories');
vi.mock('../../hooks/useAuthor');

const tech = { id: 'tech', name: 'Technology', postId: '', createdAt: '', updatedAt: '' };
const health = { id: 'health', name: 'Health', postId: '', createdAt: '', updatedAt: '' };
const emily = { id: 'emily', name: 'Emily Davis', profilePicture: '', createdAt: '', updatedAt: '' };
const john = { id: 'john', name: 'John Smith', profilePicture: '', createdAt: '', updatedAt: '' };

function post(id: string, title: string, createdAt: string, author = emily, categories = [tech]): Post {
  return {
    id,
    title,
    content: 'Lorem ipsum',
    thumbnail_url: '',
    createdAt,
    updatedAt: createdAt,
    author,
    authorId: author.id,
    categories,
  };
}

const posts = [
  post('ai', 'AI in Healthcare', '2024-03-01T12:00:00Z', emily, [tech, health]),
  post('habits', 'Healthy Habits', '2024-01-01T12:00:00Z', john, [health]),
  post('cloud', 'The Future of Cloud', '2024-02-01T12:00:00Z', john, [tech]),
];

const refetch = vi.fn();

function mockPosts(state: Partial<ReturnType<typeof usePosts>> = {}) {
  vi.mocked(usePosts).mockReturnValue({ posts, loading: false, error: null, refetch, ...state });
}

function renderPage(filters: Partial<FiltersState> = {}) {
  render(
    <MemoryRouter>
      <FiltersProvider initialState={{ ...initialFiltersState, ...filters }}>
        <PostListPage />
      </FiltersProvider>
    </MemoryRouter>,
  );
}

function titles() {
  const region = screen.getByRole('region', { name: 'Posts' });
  return within(region)
    .queryAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPosts();
  vi.mocked(useCategories).mockReturnValue({ categories: [health, tech], loading: false, error: null, refetch: vi.fn() });
  vi.mocked(useAuthors).mockReturnValue({ authors: [emily, john], loading: false, error: null, refetch: vi.fn() });
});

describe('PostListPage', () => {
  it('lists the posts newest first', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'DWS blog' })).toBeInTheDocument();
    expect(titles()).toEqual(['AI in Healthcare', 'The Future of Cloud', 'Healthy Habits']);
    expect(screen.getByText('3 posts found')).toBeInTheDocument();
  });

  it('shows only the posts that match the active filters', () => {
    renderPage({ search: 'health', authorIds: ['john'] });

    expect(titles()).toEqual(['Healthy Habits']);
    expect(screen.getByText('1 post found')).toBeInTheDocument();
  });

  it('reverses the order with the sort button', async () => {
    const user = userEvent.setup();
    renderPage();

    // Sort is rendered twice (desktop header and mobile row); CSS shows one of them
    const [sort] = screen.getAllByRole('button', { name: /sort by/i, hidden: true });
    await user.click(sort);

    expect(titles()).toEqual(['Healthy Habits', 'The Future of Cloud', 'AI in Healthcare']);
  });

  it('shows a loading indicator', () => {
    mockPosts({ posts: null, loading: true });
    renderPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(titles()).toEqual([]);
  });

  it('lets the user retry after an error', async () => {
    const user = userEvent.setup();
    mockPosts({ posts: null, error: new ApiError(500, 'Server error') });
    renderPage();

    await user.click(within(screen.getByRole('alert')).getByRole('button', { name: /try again/i }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('offers to clear the filters when nothing matches', async () => {
    const user = userEvent.setup();
    renderPage({ search: 'kubernetes' });

    expect(screen.getByRole('heading', { name: 'No posts found' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(titles()).toHaveLength(3);
  });

  it('does not offer to clear filters when there are simply no posts', () => {
    mockPosts({ posts: [] });
    renderPage();

    expect(screen.getByRole('heading', { name: 'No posts found' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });
});