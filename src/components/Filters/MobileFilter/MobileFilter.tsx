import { useCallback } from 'react';
import Sort from '../Sort/Sort';
import styles from './MobileFilter.module.scss';
import { useCategories } from '../../../hooks/useCategories';
import { useAuthors } from '../../../hooks/useAuthor';
import { useFilters, useFiltersDispatch } from '../../../features/filters';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

function MobileFilter() {
  const { categoryIds, authorIds } = useFilters();
  const dispatch = useFiltersDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { authors, loading: authorsLoading, error: authorsError } = useAuthors();

  const setCategories = useCallback(
    (ids: string[]) => dispatch({ type: 'SET_CATEGORIES', ids }),
    [dispatch],
  );
  const setAuthors = useCallback(
    (ids: string[]) => dispatch({ type: 'SET_AUTHORS', ids }),
    [dispatch],
  );

  return (
    <div className={styles.row} role="group" aria-label="Filter and sort posts">
      <FilterDropdown
        label="Category"
        options={categories}
        selectedIds={categoryIds}
        onChange={setCategories}
        loading={categoriesLoading}
        error={Boolean(categoriesError)}
      />
      <FilterDropdown
        label="Author"
        options={authors}
        selectedIds={authorIds}
        onChange={setAuthors}
        loading={authorsLoading}
        error={Boolean(authorsError)}
      />
      <div className={styles.sort}>
        <Sort />
      </div>
    </div>
  );
}

export default MobileFilter;