import React, { useState, useEffect } from "react";
import { usePodcasts } from "../hooks/usePodcasts";
import { useFavorites } from "../hooks/useFavorites";
import { useSearchAndFilter } from "../hooks/useSearchAndFilter";
import { HomeView, ShowView, FavoritesModal, SearchBar, GenreFilter, SortFilter, AudioPlayer } from "../components";
import type { Episode } from "../services/api";

const PodcastPage: React.FC = () => {
  const { previews, genres, selectedShow, selectedSeason, isLoading, fetchShowDetails, setSelectedSeason } = usePodcasts();
  const { favorites, toggleFavorite, resetFavorites } = useFavorites(previews);
  const { filteredItems: sortedPreviews, sortOrder, setSortOrder, genreFilter, setGenreFilter, handleSearchChange, searchTerm } = useSearchAndFilter(previews);
  const { filteredItems: sortedFavorites } = useSearchAndFilter(favorites, sortOrder);
  const [view, setView] = useState<'home' | 'show'>('home');
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isFavoritesModalOpen);
  }, [isFavoritesModalOpen]);

  return (
    <div className="container">
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <GenreFilter genres={genres} genreFilter={genreFilter} setGenreFilter={setGenreFilter} />
      <SortFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <button onClick={resetFavorites} className="reset-btn" aria-label="Reset progress">
        Reset Progress
      </button>
      <button onClick={() => setIsFavoritesModalOpen(true)} className="view-fav-btn" aria-label="View favorites">
        View Favorites
      </button>

      {isLoading && <p className="loading">Loading...</p>}

      {view === 'home' && <HomeView previews={sortedPreviews} genres={genres} fetchShowDetails={fetchShowDetails} />}

      {view === 'show' && selectedShow && (
        <ShowView
          show={selectedShow}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          currentEpisode={currentEpisode}
          setCurrentEpisode={setCurrentEpisode}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setView={setView}
        />
      )}

      <FavoritesModal
        favorites={sortedFavorites}
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        toggleFavorite={toggleFavorite}
      />

      <AudioPlayer currentEpisode={currentEpisode ? { ...currentEpisode, id: String(currentEpisode.id), file: currentEpisode.audioUrl } : null} />
    </div>
  );
};

export default PodcastPage;