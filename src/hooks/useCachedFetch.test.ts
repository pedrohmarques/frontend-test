import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../lib/api';
import { clearFetchCache, useCachedFetch } from './useCachedFetch';

vi.mock('../lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/api')>()),
  api: vi.fn(),
}));

beforeEach(() => {
  clearFetchCache();
  vi.mocked(api).mockReset();
});

describe('useCachedFetch', () => {
  it('requests each path once and shares the result', async () => {
    vi.mocked(api).mockResolvedValue(['Emily']);

    const a = renderHook(() => useCachedFetch<string[]>('/authors/'));
    const b = renderHook(() => useCachedFetch<string[]>('/authors/'));
    await waitFor(() => expect(a.result.current.data).toEqual(['Emily']));
    await waitFor(() => expect(b.result.current.data).toEqual(['Emily']));

    const later = renderHook(() => useCachedFetch<string[]>('/authors/'));

    expect(later.result.current).toMatchObject({ data: ['Emily'], loading: false });
    expect(api).toHaveBeenCalledTimes(1);
  });

  it('keeps a separate cache per path', async () => {
    vi.mocked(api).mockImplementation((path: string) => Promise.resolve([path]));

    const authors = renderHook(() => useCachedFetch<string[]>('/authors/'));
    const categories = renderHook(() => useCachedFetch<string[]>('/categories/'));

    await waitFor(() => expect(authors.result.current.data).toEqual(['/authors/']));
    await waitFor(() => expect(categories.result.current.data).toEqual(['/categories/']));
    expect(api).toHaveBeenCalledTimes(2);
  });

  it('turns unknown errors into an ApiError with status 0', async () => {
    vi.mocked(api).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useCachedFetch('/authors/'));

    await waitFor(() => expect(result.current.error?.status).toBe(0));
  });
});