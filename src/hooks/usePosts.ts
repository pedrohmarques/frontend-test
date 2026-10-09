import { useCallback, useEffect, useState } from 'react';
import { getPosts } from '../services/posts.service';
import type { Post } from '../types/Posts';
import { ApiError } from '../lib/api';


let cache: Post[] | null = null;
let inflight: Promise<Post[]> | null = null;

function fetchPosts(): Promise<Post[]> {
  if (cache) return Promise.resolve(cache);

  if (!inflight) {
    inflight = getPosts().then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

function toApiError(err: unknown): ApiError {
  return err instanceof ApiError ? err : new ApiError(0, 'Unexpected error');
}

export function clearPostsCache(): void {
  cache = null;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[] | null>(cache);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    if (!cache) setLoading(true);
    setError(null);

    fetchPosts()
      .then((data) => {
        if (!ignore) setPosts(data);
      })
      .catch((err) => {
        if (!ignore) setError(toApiError(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

 
  const refetch = useCallback(() => {
    cache = null;
    setReloadKey((k) => k + 1);
  }, []);

  return { posts, loading, error, refetch };
}