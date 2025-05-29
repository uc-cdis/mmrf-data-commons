interface SearchableItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | SearchableItem
    | Array<string | number | boolean | null>;
}

export const SMTableClientSideSearch = (
  data: SearchableItem[],
  searchTerm: string,
): SearchableItem[] => {
  // Convert the search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    // Check each key in the object
    return Object.keys(item).some((key) => {
      // If the value is an object, check its properties
      if (typeof item[key] === 'object' && item[key] !== null) {
        return Object.values(item[key]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
      }
      // Otherwise, check the value directly
      return String(item[key]).toLowerCase().includes(lowerCaseSearchTerm);
    });
  });
};
