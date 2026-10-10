import { ArrowUpDown } from 'lucide-react';
import { useFilters, useFiltersDispatch } from '../../../features/filters';
import styles from './Sort.module.scss';

const SORT_LABEL = {
  newest: 'Newest first',
  oldest: 'Oldest first',
} as const;

function Sort() {
  const { sort } = useFilters();
  const dispatch = useFiltersDispatch();

  const current = SORT_LABEL[sort];
  const next = sort === 'newest' ? SORT_LABEL.oldest : SORT_LABEL.newest;

  return (
    <div className={styles.wrapper}>
      <span className={styles.label} aria-hidden="true">
        Sort by:
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => dispatch({ type: 'TOGGLE_SORT' })}
        aria-label={`Sort by: ${current}. Change to ${next.toLowerCase()}`}
      >
        {current}
        <ArrowUpDown aria-hidden="true" />
      </button>
    </div>
  );
}

export default Sort;