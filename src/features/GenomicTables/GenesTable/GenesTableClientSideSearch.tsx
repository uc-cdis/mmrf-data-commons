
export const GenesTableClientSideSearch = (
  data: object[],
  searchTerm: string,
): object[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter((item) => {
    return Object.keys(item).some((key) => {
      // If the value is an object, check its properties
      if (
        typeof item[key] === 'object' &&
        item[key] !== null
      ) {
        const processedResults = Object.values(item[key]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
        console.log('exec if statement, returns',processedResults);

        return Object.values(item[key]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
      }
      // Otherwise, check the value directly
      return String(item[key])
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
    });
  });
};
