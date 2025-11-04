export const FilesTableClientSideSearch = (
  data: any[],
  searchTerm: string,
): any[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return data.filter((item: any) => {
    return Object.keys(item).some((key) => {
      // If the value is an object, check its properties
      if (
        typeof item[key as keyof any] === 'object' &&
        item[key as keyof any] !== null
      ) {
        return Object.values(item[key as keyof any]).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm),
        );
      }
      // Otherwise, check the value directly
      return String(item[key as keyof any])
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
    });
  });
};
