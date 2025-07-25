import React, { useState, useEffect } from "react";
import { usePodcasts } from "../hooks/usePodcasts";
import { useFavorites } from "../hooks/useFavorites";
import { useSearchAndFilter } from "../hooks/useSearchAndFilter";
import HomeView from "../components/HomeView";
import ShowView from "../components/ShowView";
import FavoritesModal from "../components/FavoritesModal";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import SortFilter from "../components/SortFilter";
import AudioPlayer from "../components/AudioPlayer";

function PodcastPage({ podcastId }) {
  const {
    previews,
    genres,
    selectedShow,
    selectedSeason,
    isLoading,
    fetchShowDetails,
    setSelectedSeason,
  } = usePodcasts();
  const { favorites, toggleFavorite, resetFavorites } = useFavorites(
    previews || []
  );
  const {
    filteredItems: sortedPreviews,
    sortOrder,
    setSortOrder,
    genreFilter,
    setGenreFilter,
    handleSearchChange,
    searchTerm,
  } = useSearchAndFilter(previews || []);
  const { filteredItems: sortedFavorites } = useSearchAndFilter(
    favorites || [],
    sortOrder
  );
  const [view, setView] = useState("home");
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  useEffect(() => {
    if (podcastId) {
      fetchShowDetails(parseInt(podcastId, 10));
    }
    document.body.classList.toggle("modal-open", isFavoritesModalOpen);
  }, [podcastId, isFavoritesModalOpen, fetchShowDetails]);

  return (
    <div className="container">
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <GenreFilter
        genres={genres}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
      />
      <SortFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
      <button
        onClick={resetFavorites}
        className="reset-btn"
        aria-label="Reset progress"
      >
        Reset Progress
      </button>
      <button
        onClick={() => setIsFavoritesModalOpen(true)}
        className="view-fav-btn"
        aria-label="View favorites"
      >
        View Favorites
      </button>

      {isLoading && <p className="loading">Loading...</p>}

      {view === "home" && (
        <HomeView
          previews={sortedPreviews}
          genres={genres}
          fetchShowDetails={fetchShowDetails}
        />
      )}

      {view === "show" && selectedShow && (
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

      <AudioPlayer
        currentEpisode={
          currentEpisode
            ? {
                ...currentEpisode,
                id: currentEpisode.id,
                file: currentEpisode.file || currentEpisode.audioUrl || "",
              }
            : null
        }
      />
    </div>
  );
}

export default PodcastPage;
