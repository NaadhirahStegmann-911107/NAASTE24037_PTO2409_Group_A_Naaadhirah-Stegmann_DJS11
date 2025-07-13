export interface Episode {
    id: number;
    title: string;
    audioUrl: string;
    duration: number;
    description?: string;
}

export interface Season {
    id: number;
    title: string;
    image: string;
    episodes: Episode[];
}

export type Show = {
    id: number;
    title: string;
    description: string;
    genres: Genre[];
    updated: string;
    seasons: Season[];
    image?: string;
};
export type Preview = {
    id: string | number;
    title: string;
    description: string;
    image: string;
    seasons: number;
    genreIds: number[];
    updated: string | number | Date;
};

export interface Genre {
    id: number;
    title: string;
}

export interface Favorite {
    showId: number;
    seasonId: number;
    episodeId: number;
    addedAt: string;
    showTitle: string;
    seasonTitle: string;
    episodeTitle: string;
}