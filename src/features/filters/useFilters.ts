import { useContext, type Dispatch } from 'react';
import { FiltersDispatchContext, FiltersStateContext } from './filtersContext';
import type { FiltersAction, FiltersState } from './filtersReducer';

export function useFilters(): FiltersState {
  const context = useContext(FiltersStateContext);
  if (!context) throw new Error('useFilters must be used inside <FiltersProvider>');
  return context;
}

export function useFiltersDispatch(): Dispatch<FiltersAction> {
  const context = useContext(FiltersDispatchContext);
  if (!context) throw new Error('useFiltersDispatch must be used inside <FiltersProvider>');
  return context;
}