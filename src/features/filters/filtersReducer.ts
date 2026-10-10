export type SortOrder = 'newest' | 'oldest';

export interface FiltersState {
  search: string;
  categoryIds: string[];
  authorIds: string[];
  sort: SortOrder;
}

export const initialFiltersState: FiltersState = {
  search: '',
  categoryIds: [],
  authorIds: [],
  sort: 'newest',
};

export type FiltersAction =
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_CATEGORIES'; ids: string[] }
  | { type: 'SET_AUTHORS'; ids: string[] }
  | { type: 'TOGGLE_SORT' }
  | { type: 'RESET' };

export function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case 'SET_SEARCH':
      // Same value: return the same object so nothing re-renders
      if (action.search === state.search) return state;
      return { ...state, search: action.search };

    case 'SET_CATEGORIES':
      return { ...state, categoryIds: action.ids };

    case 'SET_AUTHORS':
      return { ...state, authorIds: action.ids };

    case 'TOGGLE_SORT':
      return { ...state, sort: state.sort === 'newest' ? 'oldest' : 'newest' };

    case 'RESET':
      return initialFiltersState;

    default:
      return state;
  }
}

/** Adds the id if it's missing, removes it if it's there. */
export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];
}

/** True when any filter differs from the initial state. */
export function hasActiveFilters(state: FiltersState): boolean {
  return (
    state.search.trim() !== '' || state.categoryIds.length > 0 || state.authorIds.length > 0
  );
}