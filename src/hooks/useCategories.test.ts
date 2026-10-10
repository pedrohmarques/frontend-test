import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../lib/api';
import type { Category } from '../types/Category';
import { useCachedFetch } from './useCachedFetch';
import { useCategories } from './useCategories';

vi.mock('./useCachedFetch');

const category = (name: string) => ({ id: name.toLowerCase(), name }) as Category;

function mockFetch(state: Partial<ReturnType<typeof useCachedFetch<Category[]>>>) {
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

describe('useCategories', () => {
  it('fetches the categories endpoint', () => {
    mockFetch({ data: [] });

    renderHook(() => useCategories());

    expect(useCachedFetch).toHaveBeenCalledWith('/categories/');
  });

  it('returns the categories sorted by name without touching the cached list', () => {
    const data = [category('Technology'), category('Health'), category('Science')];
    mockFetch({ data });

    const { result } = renderHook(() => useCategories());

    expect(result.current.categories.map((c) => c.name)).toEqual(['Health', 'Science', 'Technology']);
    expect(data.map((c) => c.name)).toEqual(['Technology', 'Health', 'Science']);
  });

  it('returns an empty list while loading', () => {
    mockFetch({ loading: true });

    const { result } = renderHook(() => useCategories());

    expect(result.current).toMatchObject({ categories: [], loading: true });
  });

  it('passes the error through', () => {
    const error = new ApiError(500, 'Server error');
    mockFetch({ error });

    const { result } = renderHook(() => useCategories());

    expect(result.current.error).toBe(error);
  });
});