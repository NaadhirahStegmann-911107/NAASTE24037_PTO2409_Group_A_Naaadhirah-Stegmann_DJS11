import { useState, useEffect } from "react";
import { getFavorites, saveFavorites } from "../services/localStorage";
import type { Favorite } from "../components/types";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    // Load favorites from storage once on initial mount.
    setFavorites(getFavorites());
  }, []);

  const toggleFavorite = (
    showId: number,
    seasonId: number,
    episodeId: number,
    // These are only needed when ADDING a new favorite
    showTitle?: string,
    seasonTitle?: string,
    episodeTitle?: string
  ) => {
    const exists = favorites.some(fav => fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId);
    let newFavorites: Favorite[];

    if (exists) {
      // If it exists, remove it. We don't need the titles for this.
      newFavorites = favorites.filter(fav => !(fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId));
    } else {
      // If it doesn't exist, add it. We need the titles for this.
      if (!showTitle || !seasonTitle || !episodeTitle) {
        console.error("Cannot add favorite: title information is missing.");
        return;
      }
      newFavorites = [
        ...favorites,
        {
          showId,
          seasonId,
          episodeId,
          addedAt: new Date().toISOString(),
          showTitle,
          seasonTitle,
          episodeTitle,
        }
      ];
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const resetFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
    localStorage.removeItem('listenedEpisodes');
  };

  return { favorites, toggleFavorite, resetFavorites };
};