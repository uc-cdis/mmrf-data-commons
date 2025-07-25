import { Gene } from './types';

export const GenesTableClientSideSearch = (
  data: Gene[],
  searchTerm: string,
): object[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter((item: Gene) => {
    return Object.keys(item).some((key) => {
      const typedKey = key as keyof Gene;
      // If the value is an object, check its properties
      if (typeof item[typedKey] === 'object' && item[typedKey] !== null) {
        return Object.values(item[typedKey]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
      }
      // Otherwise, check the value directly
      return String(item[typedKey]).toLowerCase().includes(lowerCaseSearchTerm);
    });
  });
};
