import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';


const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function fetchCached<T>(path: string): Promise<T> {
  if (cache.has(path)) return Promise.resolve(cache.get(path) as T);

  
  let request = inflight.get(path) as Promise<T> | undefined;
  if (!request) {
    request = api<T>(path)
      .then((data) => {
        cache.set(path, data);
        return data;
      })
      .finally(() => {
        inflight.delete(path);
      });
    inflight.set(path, request);
  }
  return request;
}

export function clearFetchCache(): void {
  cache.clear();
}

export function useCachedFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(() => (cache.get(path) as T | undefined) ?? null);
  const [loading, setLoading] = useState(() => !cache.has(path));
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (!cache.has(path)) setLoading(true);
    setError(null);

    fetchCached<T>(path)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err: unknown) => {
        if (!ignore) setError(err instanceof ApiError ? err : new ApiError(0, 'Unexpected error'));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    
    return () => {
      ignore = true;
    };
  }, [path, reloadKey]);

  const refetch = useCallback(() => {
    cache.delete(path);
    setReloadKey((key) => key + 1);
  }, [path]);

  return { data, loading, error, refetch };
}