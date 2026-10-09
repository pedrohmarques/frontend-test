import { api } from "../lib/api";
import type { Category } from "../types/Category";

export async function getCategories() {
    const categories = await api<Category[]>('/categories', { method: 'GET' });
    return categories;
}

export async function getCategoryById(id: string) {
    const category = await api<Category>(`/categories/${id}`, { method: 'GET' });
    return category;
}