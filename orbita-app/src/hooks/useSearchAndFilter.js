import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { sortAndFilterItems } from "../utils/sortAndFilter";

export function useSearchAndFilter(items, defaultSortOrder = "az") {
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [genreFilter, setGenreFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const filteredItems = useMemo(
    () => sortAndFilterItems(items || [], sortOrder, genreFilter, searchTerm),
    [items, sortOrder, genreFilter, searchTerm]
  );

  return {
    filteredItems,
    sortOrder,
    setSortOrder,
    genreFilter,
    setGenreFilter,
    searchTerm,
    handleSearchChange: (e) => debouncedSetSearchTerm(e.target.value),
  };
}
