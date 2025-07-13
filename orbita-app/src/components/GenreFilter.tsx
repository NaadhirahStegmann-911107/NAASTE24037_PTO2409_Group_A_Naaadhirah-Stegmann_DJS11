import React from "react";
import type { Genre } from "./types";

interface GenreFilterProps {
  genres: { [key: number]: Genre };
  genreFilter: number | null;
  setGenreFilter: (value: number | null) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({ genres, genreFilter, setGenreFilter }) => (
  <select
    onChange={(e) => setGenreFilter(e.target.value ? Number(e.target.value) : null)}
    className="select"
    value={genreFilter ?? ''}
    aria-label="Filter by genre"
  >
    <option value="">All Genres</option>
    {Object.entries(genres).map(([id, genre]) => (
      <option key={id} value={id}>{genre.title}</option>
    ))}
  </select>
);