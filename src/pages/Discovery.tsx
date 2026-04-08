import React, { useEffect, useMemo, useRef, useState } from 'react';
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
const ABSTRACT_FIELD_NAME = 'study_description';
const ABSTRACT_LABEL = 'Abstract';
const DETAIL_PANEL_CELL_SELECTOR = '.mantine-Table-tr-detail-panel > td';
const DETAIL_PANEL_HEADER_ATTRIBUTE = 'data-discovery-abstract-header';
const DETAIL_PANEL_OBSERVER_DEBOUNCE_MS = 100;

const extractLabel = (config: DiscoveryIndexConfig, index: number): string => {
  const pageTitle = config.features?.pageTitle as
    | { title?: string; text?: string }
    | undefined;
  return config.label ?? pageTitle?.title ?? pageTitle?.text ?? `Index ${index + 1}`;
};

const renameStudyDescriptionField = <
  T extends {
    field?: string;
    name?: string;
  } | undefined,
>(
  fieldConfig: T,
): T =>
  fieldConfig?.field === ABSTRACT_FIELD_NAME
    ? ({ ...fieldConfig, name: ABSTRACT_LABEL } as T)
    : fieldConfig;

const patchDiscoveryIndexLabels = (
  config: DiscoveryIndexConfig,
): DiscoveryIndexConfig => ({
  ...config,
  studyPreviewField: renameStudyDescriptionField(config.studyPreviewField),
  simpleDetailsView: config.simpleDetailsView
    ? {
        ...config.simpleDetailsView,
        fieldsToShow: config.simpleDetailsView.fieldsToShow?.map((group) => ({
          ...group,
          fields: group.fields?.map(renameStudyDescriptionField),
        })),
      }
    : config.simpleDetailsView,
});

const shouldHideSelectionColumn = (config?: DiscoveryIndexConfig): boolean =>
  !config?.tableConfig?.selectableRows &&
  !config?.tableConfig?.selectableRowConfiguration;

const addAbstractHeadersToDetailPanels = () => {
  document
    .querySelectorAll<HTMLTableCellElement>(DETAIL_PANEL_CELL_SELECTOR)
    .forEach((cell) => {
      if (cell.querySelector(`[${DETAIL_PANEL_HEADER_ATTRIBUTE}]`)) {
        return;
      }

      const header = document.createElement('div');
      header.setAttribute(DETAIL_PANEL_HEADER_ATTRIBUTE, 'true');
      header.textContent = ABSTRACT_LABEL;
      header.style.fontSize = 'var(--mantine-font-size-sm)';
      header.style.fontWeight = '400';
      header.style.marginBottom = '0.25rem';

      cell.prepend(header);
    });
};

const renderDiscoveryIndexPanel = (
  config: DiscoveryIndexConfig,
  indexSelector: React.ReactNode | null,
) => (
  <div
    className="w-full"
    data-hide-selection-column={
      shouldHideSelectionColumn(config) ? 'true' : undefined
    }
  >
    <DiscoveryIndexPanel indexSelector={indexSelector} />
  </div>
);

const Discovery = ({
  headerProps,
  footerProps,
  discoveryConfig,
}: DiscoveryRouteProps) => {
  const discoveryContainerRef = useRef<HTMLDivElement | null>(null);
  const metadataConfig = Array.isArray(discoveryConfig?.metadataConfig)
    ? discoveryConfig.metadataConfig
    : [];
  const patchedMetadataConfig = useMemo(
    () => metadataConfig.map(patchDiscoveryIndexLabels),
    [metadataConfig],
  );
  const [metadataIndex, setMetadataIndex] = useState('0');
  const menuItems = useMemo(
    () =>
      patchedMetadataConfig.map((config, index) => ({
        value: index.toString(),
        label: extractLabel(config, index),
      })),
    [patchedMetadataConfig],
  );

  useEffect(() => {
    document.body.dataset.discoveryPage = 'true';
    addAbstractHeadersToDetailPanels();

    const observerTarget = discoveryContainerRef.current;
    let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

    if (!observerTarget) {
      return () => {
        delete document.body.dataset.discoveryPage;
      };
    }

    const observer = new MutationObserver(() => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        addAbstractHeadersToDetailPanels();
      }, DETAIL_PANEL_OBSERVER_DEBOUNCE_MS);
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
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
      <div ref={discoveryContainerRef} className="w-full">
        {menuItems.length === 0 ? (
          <Center maw={400} h={100} mx="auto">
            <div>No discovery configuration</div>
          </Center>
        ) : menuItems.length === 1 ? (
          renderDiscoveryIndexPanel(patchedMetadataConfig[0], null)
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
                  {renderDiscoveryIndexPanel(
                    patchedMetadataConfig[Number.parseInt(item.value, 10)],
                    menuItems.length > 1 ? (
                      <Select
                        label="Metadata:"
                        data={menuItems}
                        value={metadataIndex}
                        onChange={(value) => setMetadataIndex(value ?? '0')}
                      />
                    ) : null,
                  )}
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
