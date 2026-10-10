import { Check } from 'lucide-react';
import { memo } from 'react';
import styles from './FilterItem.module.scss';

interface FilterItemProps {
  id: string;
  label: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

function FilterItem({ id, label, selected, onToggle }: FilterItemProps) {
  return (
    <button type="button" className={styles.item} aria-pressed={selected} onClick={() => onToggle(id)}>
      <span className={styles.label}>{label}</span>
      {selected && <Check className={styles.check} size={16} aria-hidden="true" />}
    </button>
  );
}

export default memo(FilterItem);