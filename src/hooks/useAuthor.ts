import { useMemo } from 'react';
import { useCachedFetch } from './useCachedFetch';
import type { Author } from '../types/Authors';

export function useAuthors() {
  const { data, loading, error, refetch } = useCachedFetch<Author[]>('/authors/');

  const authors = useMemo(
    () => (data ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : []),
    [data],
  );

  return { authors, loading, error, refetch };
}