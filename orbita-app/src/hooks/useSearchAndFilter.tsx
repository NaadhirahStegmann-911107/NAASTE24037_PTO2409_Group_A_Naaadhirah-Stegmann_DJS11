import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { sortAndFilterItems } from "../utils/sortAndFilter";
import type { Preview, Favorite } from "../components/types";

export const useSearchAndFilter = <T extends Preview | Favorite>(
  items: T[],
  defaultSortOrder: 'az' | 'za' | 'newest' | 'oldest' = 'az'
) => {
  const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'newest' | 'oldest'>(defaultSortOrder);
  const [genreFilter, setGenreFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredItems = useMemo(
    () => sortAndFilterItems(items, sortOrder, genreFilter, searchTerm),
    [items, sortOrder, genreFilter, searchTerm]
  );

  return {
    filteredItems,
    sortOrder,
    setSortOrder,
    genreFilter,
    setGenreFilter,
    searchTerm,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => debouncedSetSearchTerm(e.target.value),
  };
};