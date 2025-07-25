import React from "react";

function FavoritesModal({ favorites, isOpen, onClose, toggleFavorite }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="close-modal-btn"
          aria-label="Close favorites modal"
        >
          ×
        </button>
        <h2 id="favorites-title" className="favorites-title">
          Favorites
        </h2>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div
              key={`${fav.showId}-${fav.seasonId}-${fav.episodeId}`}
              className="favorite-item"
            >
              <p>
                <strong>Show:</strong> {fav.showTitle}
              </p>
              <p>
                <strong>Season:</strong> {fav.seasonTitle}
              </p>
              <p>
                <strong>Episode:</strong> {fav.episodeTitle}
              </p>
              <p>Added: {new Date(fav.addedAt).toLocaleString()}</p>
              <button
                onClick={() =>
                  toggleFavorite(fav.showId, fav.seasonId, fav.episodeId)
                }
                className="remove-fav"
                aria-label={`Remove ${fav.episodeTitle} from favorites`}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>You have no favorite episodes yet.</p>
        )}
      </div>
    </div>
  );
}

export default FavoritesModal;
