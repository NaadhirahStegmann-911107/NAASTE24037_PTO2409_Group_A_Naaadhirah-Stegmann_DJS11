export function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("favorites") || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error parsing favorites from localStorage:", e);
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites || []));
  } catch (e) {
    console.error("Error saving favorites to localStorage:", e);
  }
}
