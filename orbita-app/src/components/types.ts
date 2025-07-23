export interface Preview {
  id: number;
  title: string;
  description: string;
  seasons: number;
  image: string;
  genreIds: number[];
  updated: string;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  genres?: Genre[];
  updated?: string;
  image?: string;
  seasons: Season[];
}

export interface Season {
  id: number;
  title: string;
  image?: string;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  file: string;
  title: string;
  duration?: number;
  description?: string;
  audioUrl?: string;
}

export interface Genre {
  id: number;
  title: string;
  description: string;
  showIds: number[];
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