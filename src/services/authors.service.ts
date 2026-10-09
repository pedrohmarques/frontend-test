import { api } from "../lib/api";
import type { Author } from "../types/Authors";

export async function getAuthors() {
    const authors = await api<Author[]>('/authors', { method: 'GET' });
    return authors;
}

export async function getAuthorById(id: string) {
    const author = await api<Author>(`/authors/${id}`, { method: 'GET' });
    return author;
}