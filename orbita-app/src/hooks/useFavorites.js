import { useState, useEffect } from "react";
import { getFavorites, saveFavorites } from "../services/localStorage";

export function useFavorites(initialData) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    console.log("Initial data in useEffect:", initialData);
    const storedFavorites = getFavorites();
    if (initialData && Array.isArray(initialData)) {
      const updatedFavorites = storedFavorites.map((fav) => {
        if (!fav.showTitle || !fav.seasonTitle || !fav.episodeTitle) {
          let show;
          if (initialData[0] && "seasons" in initialData[0]) {
            show = initialData.find((s) => Number(s.id) === fav.showId);
          } else {
            show = initialData.find((p) => Number(p.id) === fav.showId);
          }
          if (!show) {
            console.warn(`Show not found for showId: ${fav.showId}`);
            return {
              ...fav,
              showTitle: "Unknown Show",
              seasonTitle: "Unknown Season",
              episodeTitle: "Unknown Episode",
            };
          }
          let seasonTitle = "Unknown Season";
          let episodeTitle = "Unknown Episode";
          if ("seasons" in show && Array.isArray(show.seasons)) {
            const season = show.seasons.find((s) => s.id === fav.seasonId);
            if (season) {
              seasonTitle = season.title || "Unknown Season";
              const episode = season.episodes.find(
                (e) => e.id === fav.episodeId
              );
              if (episode) {
                episodeTitle = episode.title || "Unknown Episode";
              }
            }
          }
          return {
            ...fav,
            showTitle: show.title || "Unknown Show",
            seasonTitle,
            episodeTitle,
          };
        }
        return fav;
      });
      setFavorites(updatedFavorites);
      saveFavorites(updatedFavorites);
    } else {
      console.warn(
        "Initial data is not an array or is undefined:",
        initialData
      );
      setFavorites(storedFavorites);
    }
  }, [initialData]);

  const toggleFavorite = (
    showId,
    seasonId,
    episodeId,
    showTitle,
    seasonTitle,
    episodeTitle
  ) => {
    console.log("Initial data in toggleFavorite:", initialData);
    const exists = favorites.some(
      (fav) =>
        fav.showId === showId &&
        fav.seasonId === seasonId &&
        fav.episodeId === episodeId
    );
    let newFavorites;

    if (exists) {
      newFavorites = favorites.filter(
        (fav) =>
          !(
            fav.showId === showId &&
            fav.seasonId === seasonId &&
            fav.episodeId === episodeId
          )
      );
    } else {
      if (!showTitle || !seasonTitle || !episodeTitle) {
        if (!initialData || !Array.isArray(initialData)) {
          console.error(
            "Cannot add favorite: Initial data is missing or invalid."
          );
          return;
        }
        let show;
        if (initialData[0] && "seasons" in initialData[0]) {
          show = initialData.find((s) => Number(s.id) === showId);
        } else {
          show = initialData.find((p) => Number(p.id) === showId);
        }
        if (!show) {
          console.error(
            `Cannot add favorite: Show not found for showId ${showId}`
          );
          return;
        }
        showTitle = show.title || "Unknown Show";
        if ("seasons" in show && Array.isArray(show.seasons)) {
          const season = show.seasons.find((s) => s.id === seasonId);
          if (season) {
            seasonTitle = season.title || "Unknown Season";
            const episode = season.episodes.find((e) => e.id === episodeId);
            if (episode) {
              episodeTitle = episode.title || "Unknown Episode";
            }
          }
        }
        if (!seasonTitle) seasonTitle = "Unknown Season";
        if (!episodeTitle) episodeTitle = "Unknown Episode";
      }
      newFavorites = [
        ...favorites,
        {
          showId,
          seasonId,
          episodeId,
          addedAt: new Date().toISOString(),
          showTitle: showTitle || "Unknown Show",
          seasonTitle: seasonTitle || "Unknown Season",
          episodeTitle: episodeTitle || "Unknown Episode",
        },
      ];
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const resetFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
    localStorage.removeItem("listenedEpisodes");
  };

  return { favorites, toggleFavorite, resetFavorites };
}
