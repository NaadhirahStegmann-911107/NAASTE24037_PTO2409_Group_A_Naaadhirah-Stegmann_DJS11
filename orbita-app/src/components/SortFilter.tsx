import React from "react";

interface SortFilterProps {
  sortOrder: 'az' | 'za' | 'newest' | 'oldest';
  setSortOrder: (value: 'az' | 'za' | 'newest' | 'oldest') => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ sortOrder, setSortOrder }) => (
  <select
    onChange={(e) => setSortOrder(e.target.value as 'az' | 'za' | 'newest' | 'oldest')}
    className="select"
    value={sortOrder}
    aria-label="Sort order"
  >
    <option value="az">A-Z</option>
    <option value="za">Z-A</option>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
);