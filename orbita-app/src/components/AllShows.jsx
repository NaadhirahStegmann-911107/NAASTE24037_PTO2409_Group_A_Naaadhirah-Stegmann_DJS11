import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function AllShows() {
  const { previews } = useOutletContext();
  const navigate = useNavigate();

  // The loading state is now handled by the parent App component.
  // We can add a guard clause here for when previews aren't ready.
  if (!previews || previews.length === 0) {
    return <div className="container">No shows available.</div>;
  }

  return (
    <div className="container">
      <h1>All Shows</h1>
      <div className="show-list">
        {previews.map((show) => (
          <div
            key={show.id}
            className="show-preview"
            onClick={() => navigate(`/podcast/${show.id}`)}
            style={{ cursor: "pointer" }}
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
