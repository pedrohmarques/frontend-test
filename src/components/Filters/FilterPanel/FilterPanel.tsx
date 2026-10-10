import { SlidersHorizontal } from 'lucide-react';
import { useCallback, useState, type FormEvent } from 'react';
import { toggleId, useFilters, useFiltersDispatch } from '../../../features/filters';
import FilterGroup from '../FilterGroup/FilterGroup';
import styles from './FilterPanel.module.scss';
import { useCategories } from '../../../hooks/useCategories';
import { useAuthors } from '../../../hooks/useAuthor';

// global filters when the user clicks "Apply filters" (as in the design).
function FilterPanel() {
  const filters = useFilters();
  const dispatch = useFiltersDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { authors, loading: authorsLoading, error: authorsError } = useAuthors();

  const [draftCategoryIds, setDraftCategoryIds] = useState(filters.categoryIds);
  const [draftAuthorIds, setDraftAuthorIds] = useState(filters.authorIds);

  // When the applied filters change somewhere else ("Clear filters", mobile dropdowns), reset the draft.
  const [appliedCategoryIds, setAppliedCategoryIds] = useState(filters.categoryIds);
  const [appliedAuthorIds, setAppliedAuthorIds] = useState(filters.authorIds);

  if (filters.categoryIds !== appliedCategoryIds) {
    setAppliedCategoryIds(filters.categoryIds);
    setDraftCategoryIds(filters.categoryIds);
  }
  if (filters.authorIds !== appliedAuthorIds) {
    setAppliedAuthorIds(filters.authorIds);
    setDraftAuthorIds(filters.authorIds);
  }

  // Stable functions so the memoized FilterItems don't re-render for nothing
  const toggleCategory = useCallback((id: string) => {
    setDraftCategoryIds((ids) => toggleId(ids, id));
  }, []);

  const toggleAuthor = useCallback((id: string) => {
    setDraftAuthorIds((ids) => toggleId(ids, id));
  }, []);

  const handleApply = (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'SET_CATEGORIES', ids: draftCategoryIds });
    dispatch({ type: 'SET_AUTHORS', ids: draftAuthorIds });
  };

  return (
    <aside className={styles.panel} aria-labelledby="filters-title">
      <form className={styles.form} onSubmit={handleApply}>
        <h2 id="filters-title" className={styles.title}>
          <SlidersHorizontal size={20} aria-hidden="true" />
          Filters
        </h2>

        <FilterGroup
          label="Category"
          showTitle
          options={categories}
          selectedIds={draftCategoryIds}
          onToggle={toggleCategory}
          loading={categoriesLoading}
          error={Boolean(categoriesError)}
        />

        <FilterGroup
          label="Author"
          showTitle
          options={authors}
          selectedIds={draftAuthorIds}
          onToggle={toggleAuthor}
          loading={authorsLoading}
          error={Boolean(authorsError)}
        />

        <button
          type="submit"
          className={`button primary fullWidth`}
        >
          Apply filters
        </button>
      </form>
    </aside>
  );
}

export default FilterPanel;