interface ApiPreview {
  id: number;
  title: string;
  description: string;
  seasons: number; 
  image: string;
  genre_ids: number[];
  updated: string;
}

interface ApiSeason {
  id: number;
  title: string;
  image?: string;
  episodes: ApiEpisode[];
}

interface ApiEpisode {
  id: number;
  file: string;
  title: string;
  duration?: number;
  description?: string;
}

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
}

export interface Genre {
  id: number;
  title: string;
  description: string;
  showIds: number[];
}

export const fetchPreviews = async (): Promise<Preview[]> => {
  try {
    const response = await fetch('https://podcast-api.netlify.app/shows');
    if (!response.ok) throw new Error('Failed to fetch previews');
    const data = await response.json();
    console.log("Fetched previews data:", data);
    if (Array.isArray(data)) {
      return data.map((item: ApiPreview): Preview => ({
        id: item.id,
        title: item.title || 'Unknown Title',
        description: item.description || '',
        seasons: item.seasons || 0,
        image: item.image || '',
        genreIds: item.genre_ids || [],
        updated: item.updated || new Date().toISOString(),
      }));
    }
    console.warn("Unexpected data format for previews:", data);
    return [];
  } catch (error) {
    console.error("Error fetching previews:", error);
    return [];
  }
};

export const fetchGenre = async (id: number): Promise<Genre> => {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch genre with ID ${id}`);
    const data = await response.json();
    console.log("Fetched genre data:", data);
    return {
      id: data.id,
      title: data.title || 'Unknown Genre',
      description: data.description || '',
      showIds: data.show_ids || [],
    };
  } catch (error) {
    console.error("Error fetching genre:", error);
    return { id, title: 'Unknown Genre', description: '', showIds: [] };
  }
};

export const fetchShow = async (id: number): Promise<Show> => {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch show with ID ${id}`);
    const data = await response.json();
    console.log("Fetched show data:", data);
    if (data && typeof data === 'object') {
      return {
        id: data.id,
        title: data.title || 'Unknown Show',
        description: data.description || '',
        genres: Array.isArray(data.genres) ? data.genres.map((g: { id: number; title: string; description: string; show_ids: number[] }): Genre => ({
          id: g.id,
          title: g.title || 'Unknown Genre',
          description: g.description || '',
          showIds: g.show_ids || [],
        })) : [],
        updated: data.updated || new Date().toISOString(),
        image: data.image || '',
        seasons: Array.isArray(data.seasons) ? data.seasons.map((season: ApiSeason): Season => ({
          id: season.id,
          title: season.title || 'Unknown Season',
          image: season.image || '',
          episodes: Array.isArray(season.episodes) ? season.episodes.map((episode: ApiEpisode): Episode => ({
            id: episode.id,
            file: episode.file || '',
            title: episode.title || 'Unknown Episode',
            duration: episode.duration || 0,
            description: episode.description || '',
          })) : [],
        })) : [],
      };
    }
    throw new Error("Invalid show data format");
  } catch (error) {
    console.error("Error fetching show:", error);
    return { id, title: 'Unknown Show', description: '', seasons: [] };
  }
};