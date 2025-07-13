import React from "react";
import type { Preview, Genre } from "./types";

interface ShowCardProps {
    preview: Preview;
    genres: { [key: number]: Genre };
}

const ShowCard: React.FC<ShowCardProps> = ({ preview, genres }) => {
    const genreTitles = preview.genreIds
        .map(id => genres[id]?.title)
        .filter(Boolean)
        .join(', ');
    const updatedDate = new Date(preview.updated).toLocaleDateString();

    return (
        <div className="card">
            <img src={preview.image} alt={preview.title} />
            <h3>{preview.title}</h3>
            <p>{preview.description}</p>
            <p>Seasons: {preview.seasons}</p>
            <p>Genres: {genreTitles}</p>
            <p>Last Updated: {updatedDate}</p>
        </div>
    );
};

export default ShowCard;