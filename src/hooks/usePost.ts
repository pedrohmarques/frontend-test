// src/hooks/usePost.ts
import { useEffect, useState } from 'react';
import type { Post } from '../types/Posts';
import { ApiError } from '../lib/api';
import { getPostsById } from '../services/posts.service';

export function usePost(id: string | undefined, initialPost?: Post) {
  const [post, setPost] = useState<Post | null>(initialPost ?? null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!id) return;

    if (initialPost?.id === id) {
        setPost(initialPost);
        setLoading(false);
        setError(null);
        return;
    }

    const controller = new AbortController();
    setPost(null)
    setLoading(true);
    setError(null);

    getPostsById(id).then((data) => setPost(data)).catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err : new ApiError(0, 'Unexpected error'));
    }).finally(() => {
        if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [id, initialPost]);

  return { post, loading, error };
}