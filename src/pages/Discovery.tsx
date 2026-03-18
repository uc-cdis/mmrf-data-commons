import React, { useEffect, useMemo, useState } from 'react';
import { Center, Select, Tabs, Text } from '@mantine/core';
import {
  type DiscoveryConfig,
  type FooterProps,
  type HeaderMetadata,
  type HeaderProps,
  DiscoveryIndexPanel,
  NavPageLayout,
  DiscoveryPageGetServerSideProps as getServerSideProps,
  DiscoveryCellRendererFactory,
  registerDiscoveryDefaultCellRenderers,
} from '@gen3/frontend';


registerDiscoveryDefaultCellRenderers();

const DemoManifestCellRenderer = ({ value }: { value: unknown }) => {
  if (!Array.isArray(value)) return <Text>0</Text>;
  if (value.length === 0) return <Text>0</Text>;
  const firstEntry = value[0];
  if (!Array.isArray(firstEntry)) return <Text>{value.length}</Text>;
  return <Text>{firstEntry.length}</Text>;
};

DiscoveryCellRendererFactory.registerCellRendererCatalog({
  manifest: {
    default: DemoManifestCellRenderer,
    inline: DemoManifestCellRenderer,
  },
});

type DiscoveryRouteProps = {
  headerProps: HeaderProps;
  footerProps: FooterProps;
  discoveryConfig?: DiscoveryConfig;
};

type DiscoveryIndexConfig = DiscoveryConfig['metadataConfig'][number];

const EmptyHeader = () => null;

const extractLabel = (config: DiscoveryIndexConfig, index: number): string => {
  const pageTitle = config.features?.pageTitle as
    | { title?: string; text?: string }
    | undefined;
  return config.label ?? pageTitle?.title ?? pageTitle?.text ?? `Index ${index + 1}`;
};

const Discovery = ({
  headerProps,
  footerProps,
  discoveryConfig,
}: DiscoveryRouteProps) => {
  const metadataConfig = Array.isArray(discoveryConfig?.metadataConfig)
    ? discoveryConfig.metadataConfig
    : [];
  const [metadataIndex, setMetadataIndex] = useState('0');
  const menuItems = useMemo(
    () =>
      metadataConfig.map((config, index) => ({
        value: index.toString(),
        label: extractLabel(config, index),
      })),
    [metadataConfig],
  );

  useEffect(() => {
    document.body.dataset.discoveryPage = 'true';

    return () => {
      delete document.body.dataset.discoveryPage;
    };
  }, []);

  if (!discoveryConfig || !Array.isArray(discoveryConfig.metadataConfig)) {
    return (
      <Center maw={400} h={100} mx="auto">
        <div>Discovery config is not defined. Page disabled</div>
      </Center>
    );
  }

  const headerMetadata: HeaderMetadata = {
    title: 'Gen3 Discovery Page',
    content: 'Discovery Data',
    key: 'gen3-discovery-page',
    ...(discoveryConfig.headerMetadata ?? {}),
  };

  return (
    <NavPageLayout
      headerProps={headerProps}
      footerProps={footerProps}
      headerMetadata={headerMetadata}
      CustomHeaderComponent={EmptyHeader}
      CustomFooterComponent={EmptyHeader}
    >
      <div className="w-full">
        {menuItems.length === 0 ? (
          <Center maw={400} h={100} mx="auto">
            <div>No discovery configuration</div>
          </Center>
        ) : menuItems.length === 1 ? (
          <DiscoveryIndexPanel
            discoveryConfig={discoveryConfig.metadataConfig[0]}
            indexSelector={null}
          />
        ) : (
          <div className="flex flex-col items-center p-4 w-full bg-base-lightest">
            <Tabs
              className="w-full"
              value={metadataIndex}
              variant={discoveryConfig.metadataConfig[0]?.tabType}
              onChange={(value) => setMetadataIndex(value ?? '0')}
            >
              <Tabs.List>
                {menuItems.map((item) => (
                  <Tabs.Tab key={item.value} value={item.value}>
                    {item.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {menuItems.map((item) => (
                <Tabs.Panel key={item.value} value={item.value}>
                  <DiscoveryIndexPanel
                    discoveryConfig={
                      discoveryConfig.metadataConfig[Number.parseInt(item.value, 10)]
                    }
                    indexSelector={
                      menuItems.length > 1 ? (
                        <Select
                          label="Metadata:"
                          data={menuItems}
                          value={metadataIndex}
                          onChange={(value) => setMetadataIndex(value ?? '0')}
                        />
                      ) : null
                    }
                  />
                </Tabs.Panel>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </NavPageLayout>
  );
};

export default Discovery;

export { getServerSideProps };
