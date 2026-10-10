import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../lib/api';
import type { Author } from '../types/Authors';
import { useAuthors } from './useAuthor';
import { useCachedFetch } from './useCachedFetch';

vi.mock('./useCachedFetch');

const author = (name: string) => ({ id: name.toLowerCase(), name }) as Author;

function mockFetch(state: Partial<ReturnType<typeof useCachedFetch<Author[]>>>) {
  vi.mocked(useCachedFetch).mockReturnValue({
    data: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
    ...state,
  });
}

beforeEach(() => {
  vi.mocked(useCachedFetch).mockReset();
});

describe('useAuthors', () => {
  it('fetches the authors endpoint', () => {
    mockFetch({ data: [] });

    renderHook(() => useAuthors());

    expect(useCachedFetch).toHaveBeenCalledWith('/authors/');
  });

  it('returns the authors sorted by name without touching the cached list', () => {
    const data = [author('John Smith'), author('Emily Davis'), author('Ana Souza')];
    mockFetch({ data });

    const { result } = renderHook(() => useAuthors());

    expect(result.current.authors.map((a) => a.name)).toEqual(['Ana Souza', 'Emily Davis', 'John Smith']);
    expect(data.map((a) => a.name)).toEqual(['John Smith', 'Emily Davis', 'Ana Souza']);
  });

  it('returns an empty list while loading', () => {
    mockFetch({ loading: true });

    const { result } = renderHook(() => useAuthors());

    expect(result.current).toMatchObject({ authors: [], loading: true });
  });

  it('passes the error through', () => {
    const error = new ApiError(500, 'Server error');
    mockFetch({ error });

    const { result } = renderHook(() => useAuthors());

    expect(result.current.error).toBe(error);
  });
});