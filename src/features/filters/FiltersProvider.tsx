import { useReducer, type ReactNode } from 'react';
import { FiltersDispatchContext, FiltersStateContext } from './filtersContext';
import { filtersReducer, initialFiltersState, type FiltersState } from './filtersReducer';

interface FiltersProviderProps {
  children: ReactNode;
  initialState?: FiltersState;
}

export function FiltersProvider({ children, initialState = initialFiltersState }: FiltersProviderProps) {
  const [state, dispatch] = useReducer(filtersReducer, initialState);

  return (
    <FiltersStateContext.Provider value={state}>
      <FiltersDispatchContext.Provider value={dispatch}>{children}</FiltersDispatchContext.Provider>
    </FiltersStateContext.Provider>
  );
}