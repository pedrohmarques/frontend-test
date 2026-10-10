import { useId } from 'react';
import styles from './FilterGroup.module.scss';
import { Loading } from '../../Loading/Loading';
import FilterItem from '../FilterItem/FilterItem';

export interface FilterOption {
  id: string;
  name: string;
}

interface FilterGroupProps {
  label: string;
  showTitle?: boolean;
  options: FilterOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  loading?: boolean;
  error?: boolean;
}

function FilterGroup({
  label,
  showTitle = false,
  options,
  selectedIds,
  onToggle,
  loading = false,
  error = false,
}: FilterGroupProps) {
  const titleId = useId();

  return (
    <div className={styles.group} role="group" aria-labelledby={titleId}>
      <h3 id={titleId} className={showTitle ? styles.title : styles.srOnly}>
        {label}
      </h3>

      {loading && <Loading size="sm" label={`Loading ${label.toLowerCase()} options...`} showLabel />}

      {!loading && error && <p className={styles.message}>Could not load the options.</p>}

      {!loading && !error && (
        <ul className={styles.list}>
          {options.map((option) => (
            <li key={option.id}>
              <FilterItem
                id={option.id}
                label={option.name}
                selected={selectedIds.includes(option.id)}
                onToggle={onToggle}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterGroup;