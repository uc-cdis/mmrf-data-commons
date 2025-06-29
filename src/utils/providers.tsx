import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMantineTheme } from '@mantine/core';
import {
  entityMetadataType,
  SummaryModalContext,
  URLContext,
} from '@/utils/contexts';
import type { ImageComponentType, LinkComponentType } from '@/core/types';

import { AppContext as GDC3AppContext } from '@/utils/contexts';
import { useRouter } from 'next/router';

interface Gen3GDCCompatabilityProviderProps {
  children: ReactNode;
}

const Gen3GDCCompatabilityProvider = ({
  children,
}: Gen3GDCCompatabilityProviderProps) => {
  const [prevPath, setPrevPath] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
    entity_type: null,
    entity_id: 'not set',
  });

  const router = useRouter();
  const theme = useMantineTheme();

  useEffect(() => {
    setPrevPath(currentPath);
    setCurrentPath(globalThis.location.pathname + globalThis.location.search);
  }, [currentPath, router.asPath]);

  return (
    <SummaryModalContext.Provider
      value={{
        entityMetadata,
        setEntityMetadata,
      }}
    >
      <URLContext.Provider value={{ prevPath, currentPath }}>
        <GDC3AppContext.Provider
          value={{
            Link: Link as LinkComponentType,
            Image: Image as ImageComponentType,
            path: router.pathname,
            theme,
          }}
        >
          {children}
        </GDC3AppContext.Provider>
      </URLContext.Provider>
    </SummaryModalContext.Provider>
  );
};

export default Gen3GDCCompatabilityProvider;
