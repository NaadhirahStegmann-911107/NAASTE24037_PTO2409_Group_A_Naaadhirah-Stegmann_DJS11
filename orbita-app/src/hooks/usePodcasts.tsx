import { useState, useEffect } from "react";
import { fetchPreviews, fetchShow, fetchGenre } from "../services/api";
import type { Preview, Genre, Show, Season, Episode } from "../components/types";

export const usePodcasts = () => {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPreviews();
        console.log("Fetched previews data in usePodcasts:", data);
        const previewsMapped = data.map((preview): Preview => ({
          ...preview,
          id: typeof preview.id === "number" ? preview.id : 0,
        }));
        setPreviews(previewsMapped); // Line 23
        const uniqueGenreIds = [...new Set(previewsMapped.flatMap(preview => preview.genreIds))];
        const genrePromises = uniqueGenreIds.map(id => fetchGenre(id));
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

  const fetchShowDetails = async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await fetchShow(id);
      console.log("Fetched show data in fetchShowDetails:", data);
      const showWithRequiredProps: Show = {
        ...data,
        image: data.image || "",
        genres: Array.isArray(data.genres) ? data.genres : [],
        updated: data.updated || new Date().toISOString(),
        seasons: Array.isArray(data.seasons) ? data.seasons.map((season): Season => ({
          ...season,
          image: season.image || "",
          episodes: Array.isArray(season.episodes) ? season.episodes.map((episode): Episode => ({
            id: episode.id || 0,
            file: episode.file || "",
            title: episode.title || "Unknown Episode",
            duration: episode.duration || 0,
            description: episode.description || "",
          })) : [],
        })) : [],
      };
      setSelectedShow(showWithRequiredProps);
      setSelectedSeason(showWithRequiredProps.seasons[0] || null);
    } catch (err) {
      console.error("Failed to load show details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { previews, genres, selectedShow, selectedSeason, isLoading, fetchShowDetails, setSelectedSeason };
};