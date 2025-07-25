export async function fetchPreviews() {
  try {
    const response = await fetch("https://podcast-api.netlify.app");
    if (!response.ok) throw new Error("Failed to fetch previews");
    const data = await response.json();
    console.log("Fetched previews data:", data);
    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id || 0,
        title: item.title || "Unknown Title",
        description: item.description || "",
        seasons: item.seasons || 0,
        image: item.image || "",
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
}

export async function fetchGenre(id) {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch genre with ID ${id}`);
    const data = await response.json();
    console.log("Fetched genre data:", data);
    return {
      id: data.id || id,
      title: data.title || "Unknown Genre",
      description: data.description || "",
      showIds: data.show_ids || [],
    };
  } catch (error) {
    console.error("Error fetching genre:", error);
    return { id, title: "Unknown Genre", description: "", showIds: [] };
  }
}

export async function fetchShow(id) {
  try {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch show with ID ${id}`);
    const data = await response.json();
    console.log("Fetched show data:", data);
    if (data && typeof data === "object") {
      return {
        id: data.id || id,
        title: data.title || "Unknown Show",
        description: data.description || "",
        genres: Array.isArray(data.genres)
          ? data.genres.map((g) => ({
              id: g.id || 0,
              title: g.title || "Unknown Genre",
              description: g.description || "",
              showIds: g.show_ids || [],
            }))
          : [],
        updated: data.updated || new Date().toISOString(),
        image: data.image || "",
        seasons: Array.isArray(data.seasons)
          ? data.seasons.map((season) => ({
              id: season.id || 0,
              title: season.title || "Unknown Season",
              image: season.image || "",
              episodes: Array.isArray(season.episodes)
                ? season.episodes.map((episode) => ({
                    id: episode.id || 0,
                    file: episode.file || "",
                    title: episode.title || "Unknown Episode",
                    duration: episode.duration || 0,
                    description: episode.description || "",
                  }))
                : [],
            }))
          : [],
      };
    }
    throw new Error("Invalid show data format");
  } catch (error) {
    console.error("Error fetching show:", error);
    return { id, title: "Unknown Show", description: "", seasons: [] };
  }
}
