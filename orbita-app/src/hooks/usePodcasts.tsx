import { useState, useEffect } from "react";
import { fetchPreviews, fetchShow, fetchGenre } from "../services/api";
import type { Preview, Genre, Show, Season } from "../components/types";

export const usePodcasts = () => {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [genres, setGenres] = useState<{ [key: number]: Genre }>({});
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPreviews();
        const previewsWithStringId = data.map((preview: Preview) => ({
          ...preview,
          id: String(preview.id),
        }));
        setPreviews(previewsWithStringId);

        const uniqueGenreIds = [...new Set(previewsWithStringId.flatMap(preview => preview.genreIds))];
        const genreData = await Promise.all(uniqueGenreIds.map(id => fetchGenre(id)));
        const genreMap = genreData.reduce((acc, genre) => ({ ...acc, [genre.id]: genre }), {});
        setGenres(genreMap);
      } catch (err) {
        console.error("Failed to load podcasts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchShowDetails = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await fetchShow(id);
      const showWithRequiredProps: Show = {
        ...data,
        image: data.image ?? "",
        genres: data.genres ?? [],
        updated: data.updated ?? new Date().toISOString(),
        seasons: (data.seasons ?? []).map(season => ({
          ...season,
          image: season.image ?? "",
          episodes: (season.episodes ?? []).map(episode => ({
            ...episode,
            audioUrl: episode.audioUrl ?? "",
            duration: episode.duration ?? 0,
            description: episode.description ?? "",
          })),
        })),
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