import { useState, useEffect } from "react";
import { fetchPreviews, fetchShow, fetchGenre } from "../services/api";

export function usePodcasts() {
  const [previews, setPreviews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPreviews();
        console.log("Fetched previews data in usePodcasts:", data);
        const previewsMapped = data.map((preview) => ({
          ...preview,
          id: typeof preview.id === "number" ? preview.id : 0,
        }));
        setPreviews(previewsMapped);
        const uniqueGenreIds = [
          ...new Set(previewsMapped.flatMap((preview) => preview.genreIds)),
        ];
        const genrePromises = uniqueGenreIds.map((id) => fetchGenre(id));
        const genreData = await Promise.all(genrePromises);
        setGenres(genreData);
      } catch (err) {
        console.error("Failed to load podcasts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchShowDetails = async (id) => {
    setIsLoading(true);
    try {
      const data = await fetchShow(id);
      console.log("Fetched show data in fetchShowDetails:", data);
      const showWithRequiredProps = {
        ...data,
        image: data.image || "",
        genres: Array.isArray(data.genres) ? data.genres : [],
        updated: data.updated || new Date().toISOString(),
        seasons: Array.isArray(data.seasons)
          ? data.seasons.map((season) => ({
              ...season,
              image: season.image || "",
              episodes: Array.isArray(season.episodes)
                ? season.episodes.map((episode) => ({
                    id: episode.id || 0,
                    file: episode.file || "",
                    title: episode.title || "Unknown Episode",
                    duration: episode.duration || 0,
                    description: episode.description || "",
                  }))
                : [],
            }))
          : [],
      };
      setSelectedShow(showWithRequiredProps);
      setSelectedSeason(showWithRequiredProps.seasons[0] || null);
    } catch (err) {
      console.error("Failed to load show details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previews,
    genres,
    selectedShow,
    selectedSeason,
    isLoading,
    fetchShowDetails,
    setSelectedSeason,
  };
}
