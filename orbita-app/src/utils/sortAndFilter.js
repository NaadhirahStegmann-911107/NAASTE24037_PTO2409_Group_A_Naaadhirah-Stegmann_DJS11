export function sortAndFilterItems(items, sortOrder, genreFilter, searchTerm) {
  if (!Array.isArray(items)) return [];
  let result = [...items];

  if (items.length > 0 && "genreIds" in items[0] && genreFilter) {
    result = result.filter((item) => {
      if ("genreIds" in item) {
        return item.genreIds.includes(genreFilter);
      }
      return true;
    });
  }

  if (searchTerm) {
    result = result.filter((item) => {
      const isPreview = "title" in item && "description" in item;
      const searchText = isPreview
        ? (item.title && item.title.toLowerCase()) ||
          (item.description && item.description.toLowerCase())
        : item.episodeTitle && item.episodeTitle.toLowerCase();
      return searchText && searchText.includes(searchTerm.toLowerCase());
    });
  }

  switch (sortOrder) {
    case "az":
      return result.sort((a, b) => {
        const aTitle = "title" in a ? a.title : a.episodeTitle;
        const bTitle = "title" in b ? b.title : b.episodeTitle;
        return (aTitle || "").localeCompare(bTitle);
      });
    case "za":
      return result.sort((a, b) => {
        const aTitle = "title" in a ? a.title : a.episodeTitle;
        const bTitle = "title" in b ? b.title : b.episodeTitle;
        return (bTitle || "").localeCompare(aTitle);
      });
    case "newest":
      return result.sort((a, b) => {
        const aDate = "updated" in a ? a.updated : a.addedAt;
        const bDate = "updated" in b ? b.updated : b.addedAt;
        return (
          (new Date(bDate) || 0).getTime() - new Date(aDate || 0).getTime()
        );
      });
    case "oldest":
      return result.sort((a, b) => {
        const aDate = "updated" in a ? a.updated : a.addedAt;
        const bDate = "updated" in b ? b.updated : b.addedAt;
        return new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
      });
    default:
      return result;
  }
}
