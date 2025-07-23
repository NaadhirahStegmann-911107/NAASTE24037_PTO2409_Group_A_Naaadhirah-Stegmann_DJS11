import type { Preview, Favorite } from "../components/types";

export const sortAndFilterItems = <ItemType extends Preview | Favorite>(
  items: ItemType[],
  sortOrder: 'az' | 'za' | 'newest' | 'oldest',
  genreFilter: number | null,
  searchTerm: string
): ItemType[] => {
  let result = [...items];

  if ('genreIds' in items[0] && genreFilter) {
    result = result.filter((item) => {
      if ('genreIds' in item) {
        return item.genreIds.includes(genreFilter);
      }
      return true;
    });
  }

  if (searchTerm) {
    result = result.filter((item) => {
      const isPreview = 'title' in item && 'description' in item;
      const searchText = isPreview
        ? item.title.toLowerCase() || item.description.toLowerCase()
        : (item as Favorite).episodeTitle.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });
  }

  switch (sortOrder) {
    case 'az':
      return result.sort((a, b) => {
        const aTitle = 'title' in a ? a.title : (a as Favorite).episodeTitle;
        const bTitle = 'title' in b ? b.title : (b as Favorite).episodeTitle;
        return aTitle.localeCompare(bTitle);
      });
    case 'za':
      return result.sort((a, b) => {
        const aTitle = 'title' in a ? a.title : (a as Favorite).episodeTitle;
        const bTitle = 'title' in b ? b.title : (b as Favorite).episodeTitle;
        return bTitle.localeCompare(aTitle);
      });
    case 'newest':
      return result.sort((a, b) => {
        const aDate = 'updated' in a ? a.updated : (a as Favorite).addedAt;
        const bDate = 'updated' in b ? b.updated : (b as Favorite).addedAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    case 'oldest':
      return result.sort((a, b) => {
        const aDate = 'updated' in a ? a.updated : (a as Favorite).addedAt;
        const bDate = 'updated' in b ? b.updated : (b as Favorite).addedAt;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });
    default:
      return result;
  }
};