import React from "react";

function GenreFilter({ genres, genreFilter, setGenreFilter }) {
  return (
    <select
      onChange={(e) =>
        setGenreFilter(e.target.value ? Number(e.target.value) : null)
      }
      className="select"
      value={genreFilter ?? ""}
      aria-label="Filter by genre"
    >
      <option value="">All Genres</option>
      {Object.entries(genres).map(([id, genre]) => (
        <option key={id} value={id}>
          {genre.title}
        </option>
      ))}
    </select>
  );
}

export default GenreFilter;
