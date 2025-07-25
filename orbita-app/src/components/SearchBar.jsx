import React from "react";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      placeholder="Search shows..."
      value={searchTerm}
      onChange={onSearchChange}
      className="input"
      aria-label="Search shows"
    />
  );
}

export default SearchBar;
