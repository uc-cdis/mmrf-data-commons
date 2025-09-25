
// Re-export the real module first
export * from '../hooks';

// Override only the hook we need to mock
export { useGeneAndSSMPanelData } from '../mockedHooks';

export const useSelectFilterContent = (field: string): Array<string> => {
  return [];
};
