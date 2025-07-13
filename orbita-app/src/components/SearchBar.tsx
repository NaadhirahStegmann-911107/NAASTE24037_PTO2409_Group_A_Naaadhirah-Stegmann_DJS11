import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => (
  <input
    type="text"
    placeholder="Search shows..."
    value={searchTerm}
    onChange={onSearchChange}
    className="input"
    aria-label="Search shows"
  />
);