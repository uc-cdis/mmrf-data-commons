import { SomaticMutation } from '../types';

export const SMTableClientSideSearch = (
  data: SomaticMutation[],
  searchTerm: string,
): SomaticMutation[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter((item: SomaticMutation) => {
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
