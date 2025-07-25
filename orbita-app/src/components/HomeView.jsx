import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import ShowCard from "./ShowCard";

function HomeView() {
  const { previews, genres } = useOutletContext();
  const navigate = useNavigate();

  // Add a guard clause in case previews is not yet available.
  if (!previews || previews.length === 0) {
    return <p>No shows to display.</p>;
  }

  return (
    <>
      <Carousel previews={previews} genres={genres} />
      <div className="grid">
        {previews.map((preview) => (
          <div
            key={preview.id}
            onClick={() => navigate(`/podcast/${preview.id}`)}
            className="card"
          >
            <ShowCard preview={preview} genres={genres} />
          </div>
        ))}
      </div>
    </>
  );
}

export default HomeView;
