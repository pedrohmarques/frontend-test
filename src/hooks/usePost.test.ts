import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../lib/api';
import { getPostsById } from '../services/posts.service';
import type { Post } from '../types/Posts';
import { usePost } from './usePost';

vi.mock('../services/posts.service');

const makePost = (id: string, title = `Post ${id}`) => ({ id, title }) as Post;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

beforeEach(() => {
  vi.mocked(getPostsById).mockReset();
});

describe('usePost', () => {
  it('fetches the post by id', async () => {
    vi.mocked(getPostsById).mockResolvedValue(makePost('1'));

    const { result } = renderHook(() => usePost('1'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.post?.id).toBe('1'));
    expect(result.current.loading).toBe(false);
  });

  it('uses the post from router state without hitting the API', () => {
    const post = makePost('1');

    const { result } = renderHook(() => usePost('1', post));

    expect(result.current).toMatchObject({ post, loading: false });
    expect(getPostsById).not.toHaveBeenCalled();
  });

  it('exposes the API error', async () => {
    vi.mocked(getPostsById).mockRejectedValue(new ApiError(404, 'post not found'));

    const { result } = renderHook(() => usePost('missing'));

    await waitFor(() => expect(result.current.error?.status).toBe(404));
    expect(result.current.post).toBeNull();
  });

  it('ignores a slow response for a post the user already left', async () => {
    const first = deferred<Post>();
    const second = deferred<Post>();
    vi.mocked(getPostsById).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(({ id }) => usePost(id), { initialProps: { id: '1' } });
    rerender({ id: '2' });

    second.resolve(makePost('2', 'Second'));
    await waitFor(() => expect(result.current.post?.title).toBe('Second'));

    await act(async () => {
      first.resolve(makePost('1', 'First'));
    });

    expect(result.current.post?.title).toBe('Second');
  });
});