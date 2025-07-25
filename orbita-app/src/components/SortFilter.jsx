import React from "react";

function SortFilter({ sortOrder, setSortOrder }) {
  return (
    <select
      onChange={(e) => setSortOrder(e.target.value)}
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
}

export default SortFilter;
