import React, { useState, useEffect } from "react";
import { fetchPreviews } from "../services/api";

function AllShows() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPreviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPreviews();
        setPreviews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    getPreviews();
  }, []);

  if (loading) {
    return <div className="container">Loading shows...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>All Shows</h1>
      <div className="show-list">
        {previews.map((show) => (
          <div
            key={show.id || `${previews.indexOf(show)}`}
            className="show-preview"
          >
            <img src={show.image} alt={show.title} width="100" />
            <h2>{show.title}</h2>
            <p>Seasons: {show.seasons}</p>
            <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllShows;
