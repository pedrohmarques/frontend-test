import { useMemo } from 'react';
import { useCachedFetch } from './useCachedFetch';
import type { Category } from '../types/Category';

export function useCategories() {
  const { data, loading, error, refetch } = useCachedFetch<Category[]>('/categories/');

  const categories = useMemo(
    () => (data ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : []),
    [data],
  );

  return { categories, loading, error, refetch };
}