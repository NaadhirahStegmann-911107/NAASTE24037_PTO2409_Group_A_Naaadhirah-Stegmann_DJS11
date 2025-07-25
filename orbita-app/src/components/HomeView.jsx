import React from "react";
import Carousel from "./Carousel";
import ShowCard from "./ShowCard";

function HomeView({ previews, genres, fetchShowDetails }) {
  return (
    <>
      <Carousel previews={previews} genres={genres} />
      <div className="grid">
        {previews.map((preview) => (
          <div
            key={preview.id}
            onClick={() => fetchShowDetails(Number(preview.id))}
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
