import { MantineThemeOverride } from '@mantine/core';
import { ImageComponentType, LinkComponentType } from '@/core/types';
import { FilterSet } from '@/core';
import { createContext, Dispatch, SetStateAction } from 'react';

export const URLContext = createContext({ prevPath: '', currentPath: '' });

export type entityType = null | 'project' | 'case' | 'file' | 'ssms' | 'genes';

export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  contextSensitive?: boolean;
  contextFilters?: FilterSet;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null as any);

interface AppContextType {
  readonly path?: string;
  readonly theme?: MantineThemeOverride;
  readonly Image: ImageComponentType;
  readonly Link: LinkComponentType;
}

export const AppContext = createContext<AppContextType>({
  path: undefined,
  theme: undefined,
  // eslint-disable-next-line
  Image: (props) => <img {...props} />,
  // eslint-disable-next-line
  Link: (props) => <a {...props} />,
});
