import { createContext, type Dispatch } from 'react';
import type { FiltersAction, FiltersState } from './filtersReducer';

export const FiltersStateContext = createContext<FiltersState | null>(null);
export const FiltersDispatchContext = createContext<Dispatch<FiltersAction> | null>(null);