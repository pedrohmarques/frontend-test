import { FileSearch } from 'lucide-react';
import { useMemo } from 'react';
import { ErrorState } from '../../components/ErrorState/ErrorState';
import FilterPanel from '../../components/Filters/FilterPanel/FilterPanel';
import PostCard from '../../components/PostCard/PostCard';
import { filterPosts, hasActiveFilters, useFilters, useFiltersDispatch } from '../../features/filters';
import { usePosts } from '../../hooks/usePosts';
import styles from './PostListPage.module.scss';
import { Loading } from '../../components/Loading/Loading';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import Sort from '../../components/Filters/Sort/Sort';

function PostListPage() {
  const { posts, loading, error, refetch } = usePosts();
  const filters = useFilters();
  const dispatch = useFiltersDispatch();

  const visiblePosts = useMemo(() => filterPosts(posts ?? [], filters), [posts, filters]);
  const isFiltering = hasActiveFilters(filters);

  const clearFilters = () => dispatch({ type: 'RESET' });

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>DWS blog</h1>
        <div className={styles.sortDesktop}>
          <Sort />
        </div>
      </div>

      {/* Mobile here */}

      <div className={styles.layout}>
        <FilterPanel />

        <section className={styles.grid} aria-labelledby="posts-heading">
          <h2 id="posts-heading" className={styles.srOnly}>
            Posts
          </h2>

          {loading && <Loading fullPage size="xl" />}

          {error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && (
            <>
              <p className={styles.srOnly} aria-live="polite">
                {visiblePosts.length === 1 ? '1 post found' : `${visiblePosts.length} posts found`}
              </p>

              {visiblePosts.length > 0 ? (
                <ul className={styles.cards}>
                  {visiblePosts.map((post) => (
                    <li key={post.id}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              ) : (
                <StatusMessage
                  icon={FileSearch}
                  title="No posts found"
                  description={
                    isFiltering
                      ? 'Try a different search or remove some filters.'
                      : 'There are no posts to show yet.'
                  }
                  actions={
                    isFiltering && (
                      <button
                        type="button"
                        className={`button secondary`}
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    )
                  }
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default PostListPage;