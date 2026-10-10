import { ChevronDown, X } from 'lucide-react';
import { useCallback, useId, useRef, useState, type KeyboardEvent } from 'react';
import FilterGroup, { type FilterOption } from '../FilterGroup/FilterGroup';
import styles from './FilterDropdown.module.scss';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { toggleId } from '../../../features/filters';

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
  error?: boolean;
}

function FilterDropdown({
  label,
  options,
  selectedIds,
  onChange,
  loading = false,
  error = false,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef, close, isOpen);

  const selectedNames = options
    .filter((option) => selectedIds.includes(option.id))
    .map((option) => option.name);
  const hasSelection = selectedNames.length > 0;
  const triggerText = hasSelection ? selectedNames.join(', ') : label;

  const handleToggle = useCallback(
    (id: string) => onChange(toggleId(selectedIds, id)),
    [onChange, selectedIds],
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className={styles.dropdown} onKeyDown={handleKeyDown}>
      <div className={`${styles.pill} ${hasSelection || isOpen ? styles.active : ''}`}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={hasSelection ? `${label}: ${triggerText}` : label}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={styles.text}>{triggerText}</span>
          {!hasSelection && <ChevronDown className={styles.chevron} size={20} aria-hidden="true" />}
        </button>

        {/* Sibling of the trigger: a button can't contain another button */}
        {hasSelection && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange([])}
            aria-label={`Clear ${label.toLowerCase()} filter`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {isOpen && (
        <div id={panelId} className={styles.panel}>
          <FilterGroup
            label={label}
            options={options}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;