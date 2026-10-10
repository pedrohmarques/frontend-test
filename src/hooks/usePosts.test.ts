import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../lib/api';
import { getPosts } from '../services/posts.service';
import type { Post } from '../types/Posts';
import { clearPostsCache, usePosts } from './usePosts';

vi.mock('../services/posts.service');

const post = { id: '1', title: 'AI in Healthcare' } as Post;

beforeEach(() => {
  clearPostsCache();
  vi.mocked(getPosts).mockReset();
});

describe('usePosts', () => {
  it('loads the posts', async () => {
    vi.mocked(getPosts).mockResolvedValue([post]);

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.posts).toEqual([post]));
    expect(result.current.loading).toBe(false);
  });

  it('shares one request between components and caches the result', async () => {
    vi.mocked(getPosts).mockResolvedValue([post]);

    const a = renderHook(() => usePosts());
    const b = renderHook(() => usePosts());
    await waitFor(() => expect(a.result.current.posts).toHaveLength(1));
    await waitFor(() => expect(b.result.current.posts).toHaveLength(1));

    const later = renderHook(() => usePosts());

    expect(later.result.current).toMatchObject({ loading: false, posts: [post] });
    expect(getPosts).toHaveBeenCalledTimes(1);
  });

  it('recovers from an error with refetch', async () => {
    vi.mocked(getPosts)
      .mockRejectedValueOnce(new ApiError(500, 'Server error'))
      .mockResolvedValueOnce([post]);

    const { result } = renderHook(() => usePosts());
    await waitFor(() => expect(result.current.error?.status).toBe(500));

    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.posts).toEqual([post]));
    expect(result.current.error).toBeNull();
  });
});