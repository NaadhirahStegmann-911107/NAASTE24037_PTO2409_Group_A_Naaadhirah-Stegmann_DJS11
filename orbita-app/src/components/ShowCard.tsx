import React from "react";
import type { Preview, Genre } from "./types";


const GenreMap: { [key: number]: string } = {
    1: "Personal Growth",
    2: "Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
};


interface ShowCardProps {
    preview: Preview;
    genres: { [key: number]: Genre };
}

const ShowCard: React.FC<ShowCardProps> = ({ preview }) => {
    const genres = preview.genreIds.map(id => GenreMap[id]).filter(Boolean).join(', ');
    const updatedDate = new Date(preview.updated).toLocaleDateString();

    return (
        <div className="card">
            <img src={preview.image} alt={preview.title} />
            <h3>{preview.title}</h3>
            <p>{preview.description}</p>
            <p>Seasons: {preview.seasons}</p>
            <p>Genres: {genres}</p>
            <p>Last Updated: {updatedDate}</p>
        </div>
    );
};

export default ShowCard;