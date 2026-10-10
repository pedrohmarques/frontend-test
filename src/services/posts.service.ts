import { api } from "../lib/api";
import type { Post } from "../types/Posts";

export async function getPosts() {
    const posts = await api<Post[]>('/posts', { method: 'GET' });
    return posts;
}

export async function getPostsById(id: string, signal?: AbortSignal) {
    const posts = await api<Post>(`/posts/${id}`, { method: 'GET', signal });
    return posts;
}