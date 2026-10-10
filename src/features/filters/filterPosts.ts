import type { Post } from '../../types/Posts';
import type { FiltersState } from './filtersReducer';

/**
 * Applies search, category and author filters, then sorts by date.
 * - Different filters combine with AND (search AND category AND author)
 * - Options inside one filter combine with OR (category A OR category B)
 * - An empty filter means "don't filter by this"
 */
export function filterPosts(posts: Post[], filters: FiltersState): Post[] {
  const term = filters.search.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    const matchesSearch =
      term === '' ||
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.author.name.toLowerCase().includes(term);

    const matchesCategory =
      filters.categoryIds.length === 0 ||
      post.categories.some((category) => filters.categoryIds.includes(category.id));

    const matchesAuthor =
      filters.authorIds.length === 0 || filters.authorIds.includes(post.authorId);

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  // filter() already returned a new array, so sorting it doesn't touch `posts`
  return filtered.sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return filters.sort === 'newest' ? diff : -diff;
  });
}