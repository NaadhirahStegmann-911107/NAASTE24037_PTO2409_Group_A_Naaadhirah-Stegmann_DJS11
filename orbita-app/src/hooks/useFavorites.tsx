import { useState, useEffect } from "react";
import { getFavorites, saveFavorites } from "../services/localStorage";
import type { Favorite, Preview } from "../components/types";

export const useFavorites = (previews: Preview[] | undefined) => { 
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (!previews || !Array.isArray(previews)) {
      console.warn("Previews is not an array or is undefined:", previews);
      return;
    }

    const storedFavorites = getFavorites();
    const updatedFavorites = storedFavorites.map((fav: Favorite) => {
      if (!fav.showTitle || !fav.seasonTitle || !fav.episodeTitle) {
        const show = previews.find(p => Number(p.id) === fav.showId);
        const season = show?.seasons?.find((season: { id: number; }) => season.id === fav.seasonId);
        const episode = season?.episodes.find((episode: { id: number; }) => episode.id === fav.episodeId);
        return {
          ...fav,
          showTitle: show?.title || 'Unknown Show',
          seasonTitle: season?.title || 'Unknown Season',
          episodeTitle: episode?.title || 'Unknown Episode'
        };
      }
      return fav;
    });
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  }, [previews]); // Dependency is previews

  const toggleFavorite = (showId: number, seasonId: number, episodeId: number) => {
    const exists = favorites.some(fav => fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId);
    let newFavorites: Favorite[];
    if (exists) {
      newFavorites = favorites.filter(fav => !(fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId));
    } else {
      if (!previews || !Array.isArray(previews)) {
        console.warn('Cannot add favorite: Previews data is invalid');
        return;
      }
      const show = previews.find(p => Number(p.id) === showId);
      const season = show?.seasons.find((season: { id: number; }) => season.id === seasonId);
      const episode = season?.episodes.find((episode: { id: number; }) => episode.id === episodeId);
      if (!show || !season || !episode) {
        console.warn('Cannot add favorite: Data not found');
        return;
      }
      newFavorites = [
        ...favorites,
        {
          showId,
          seasonId,
          episodeId,
          addedAt: new Date().toISOString(),
          showTitle: show.title,
          seasonTitle: season.title,
          episodeTitle: episode.title,
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