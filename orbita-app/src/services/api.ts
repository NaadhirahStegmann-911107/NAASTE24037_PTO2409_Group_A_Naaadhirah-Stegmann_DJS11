interface Preview {
    id: number;
    title: string;
    description: string;
    seasons: number;
    image: string;
    genreIds: number[];
    updated: string;
}

interface Show {
    id: number;
    title: string;
    description: string;
    seasons: Season[];
}

interface Season {
    id: number;
    title: string;
    image: string;
    episodes: Episode[];
}

interface Episode {
    id: number;
    file: string;
    title: string;
}

interface Genre {
    id: number;
    title: string;
    description: string;
    showIds: number[];
}

interface Favorite {
    showId: number;
    seasonId: number;
    episodeId: number;
    addedAt: string;
}

export const fetchPreviews = async (): Promise<Preview[]> => {
    const response = await fetch('https://podcast-api.netlify.app');
    if (!response.ok) throw new Error('Failed to fetch previews');
    return response.json();
};

export const fetchGenre = async (id: number): Promise<Genre> => {
    const response = await fetch(`https://podcast-api.netlify.app/genres/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch genre with ID ${id}`);
    return response.json();
};

export const fetchShow = async (id: number): Promise<Show> => {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch show with ID ${id}`);
    return response.json();
};

