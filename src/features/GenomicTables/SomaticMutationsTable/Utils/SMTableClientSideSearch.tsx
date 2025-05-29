import { SomaticMutation } from '../types';
/* interface SearchableItem {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | SearchableItem
    | Array<string | number | boolean | null>;
} */

export const SMTableClientSideSearch = (
  data: SomaticMutation[],
  searchTerm: string,
): SomaticMutation[] => {
  // Convert the search term to lowercase for case-insensitive comparison
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((item: SomaticMutation) => {
    // Check each key in the object
    return Object.keys(item).some((key) => {
      // If the value is an object, check its properties
      if (
        typeof item[key as keyof SomaticMutation] === 'object' &&
        item[key as keyof SomaticMutation] !== null
      ) {
        return Object.values(item[key as keyof SomaticMutation]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
      }
      // Otherwise, check the value directly
      return String(item[key as keyof SomaticMutation])
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
    });
  });
};
