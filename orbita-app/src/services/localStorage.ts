import type { Favorite } from "../components/types";

export const getFavorites = (): Favorite[] => {
  try {
    const data = JSON.parse(localStorage.getItem('favorites') || '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites: Favorite[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};