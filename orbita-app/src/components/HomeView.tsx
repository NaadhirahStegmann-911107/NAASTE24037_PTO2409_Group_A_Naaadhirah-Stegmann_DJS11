import React from "react";
import Carousel from "./Carousel";
import ShowCard from "./ShowCard";
import type { Preview, Genre } from "./types";

interface HomeViewProps {
  previews: Preview[];
  genres: { [key: number]: Genre };
  fetchShowDetails: (id: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ previews, genres, fetchShowDetails }) => (
  <>
    <Carousel previews={previews} genres={genres} />
    <div className="grid">
      {previews.map((preview) => (
        <div key={preview.id} onClick={() => fetchShowDetails(Number(preview.id))} className="card">
          <ShowCard preview={preview} genres={genres} />
        </div>
      ))}
    </div>
  </>
);