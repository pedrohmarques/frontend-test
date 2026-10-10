import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Search.module.scss';
import { useFilters, useFiltersDispatch } from '../../features/filters';

interface SearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function Search({ isOpen, onOpenChange }: SearchProps) {
  const { search } = useFilters();
  const dispatch = useFiltersDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [value, setValue] = useState(search);
  const debouncedValue = useDebounce(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce on typinmg
  useEffect(() => {
    dispatch({ type: 'SET_SEARCH', search: debouncedValue });
  }, [debouncedValue, dispatch]);

  // Clear Filter
  useEffect(() => {
    if (search === '') setValue('');
  }, [search]);

  // Mobile: focus the field as soon as it opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Results only exist on the list page, so typing on a post page goes there
  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    if (pathname !== '/') navigate('/');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'SET_SEARCH', search: value });
    if (pathname !== '/') navigate('/');
    inputRef.current?.blur(); // closes the mobile keyboard
  };

  const handleClear = () => {
    setValue('');
    dispatch({ type: 'SET_SEARCH', search: '' });
    inputRef.current?.focus();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (value) handleClear();
      else handleClose();
    }
  };

  return (
    <div className={styles.wrapper}>
      {!isOpen && (
        <button
          type="button"
          className={`${styles.iconButton} ${styles.toggle}`}
          onClick={() => onOpenChange(true)}
          aria-label="Open search"
        >
          <SearchIcon size={20} aria-hidden="true" />
        </button>
      )}

      <form
        role="search"
        className={`${styles.search} ${isOpen ? styles.open : ''}`}
        onSubmit={handleSubmit}
      >
        <button type="button" className={styles.back} onClick={handleClose} aria-label="Close search">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <label htmlFor="site-search" className={styles.srOnly}>
          Search posts
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          className={styles.input}
          placeholder="Search"
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {value && (
          <button type="button" className={styles.clear} onClick={handleClear} aria-label="Clear search">
            <X size={18} aria-hidden="true" />
          </button>
        )}

        <button type="submit" className={styles.iconButton} aria-label="Search">
          <SearchIcon size={20} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export default Search;