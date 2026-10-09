import type { Author } from "./Authors";
import type { Category } from "./Category";

export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    thumbnail_url: string;
    categories: Category[];
    author: Author;
}
