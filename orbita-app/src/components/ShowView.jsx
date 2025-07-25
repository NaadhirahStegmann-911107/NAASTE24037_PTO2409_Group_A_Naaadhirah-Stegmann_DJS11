import React from "react";

function ShowView({
  show,
  selectedSeason,
  setSelectedSeason,
  currentEpisode,
  setCurrentEpisode,
  favorites,
  toggleFavorite,
  setView,
}) {
  const listenedEpisodes = (() => {
    try {
      const data = JSON.parse(localStorage.getItem("listenedEpisodes") || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  })();

  return (
    <div>
      <button
        onClick={() => setView("home")}
        className="back-btn"
        aria-label="Back to shows list"
      >
        Back to Shows
      </button>
      <h2 className="show-title">{show.title}</h2>
      <p>{show.description}</p>
      <div className="season-buttons">
        {show.seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season)}
            className={`season-btn ${
              selectedSeason?.id === season.id ? "active" : ""
            }`}
            aria-label={`Select Season ${season.title}`}
          >
            {season.title}
          </button>
        ))}
      </div>
      {selectedSeason && (
        <div>
          <img
            src={selectedSeason.image}
            alt={selectedSeason.title}
            className="season-img"
          />
          <h3 className="season-title">{selectedSeason.title}</h3>
          <p>Episodes: {selectedSeason.episodes.length}</p>
          <ul className="episode-list">
            {selectedSeason.episodes.map((episode) => {
              const isFavorite = favorites.some(
                (fav) =>
                  fav.showId === show.id &&
                  fav.seasonId === selectedSeason.id &&
                  fav.episodeId === episode.id
              );
              const isListened = listenedEpisodes.includes(episode.id);
              const isCurrent = currentEpisode?.id === episode.id;

              return (
                <li
                  key={episode.id}
                  className={isCurrent ? "current-episode" : ""}
                >
                  <p>{episode.title}</p>
                  <button
                    onClick={() => setCurrentEpisode(episode)}
                    className={`play ${isCurrent ? "playing" : ""}`}
                    aria-label={
                      isCurrent
                        ? `Playing episode ${episode.title}`
                        : `Play episode ${episode.title}`
                    }
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Playing..." : "Play"}
                  </button>
                  <button
                    onClick={() =>
                      toggleFavorite(
                        show.id,
                        selectedSeason.id,
                        episode.id,
                        show.title,
                        selectedSeason.title,
                        episode.title
                      )
                    }
                    className={`favorite ${isFavorite ? "remove" : ""}`}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFavorite ? "Remove Favorite" : "Add Favorite"}
                  </button>
                  {isListened && <span className="listened">Listened</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShowView;
