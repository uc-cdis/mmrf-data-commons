import React, { useEffect, useState } from 'react';
import { BioTree } from '@/components/BioTree/BioTree';
import { Button, Input, LoadingOverlay, ActionIcon } from '@mantine/core';
import { HorizontalTable } from '@/components/HorizontalTable';
import { formatEntityInfo, searchForStringInNode } from './utils';
import { trimEnd, find, flatten, escapeRegExp } from 'lodash';
import { useRouter } from 'next/router';
import { entityTypes, overrideMessage } from '@/components/BioTree/types';
import { HeaderTitle } from '@/components/tailwindComponents';
import { useDeepCompareEffect } from 'use-deep-compare';
import { DropdownWithIcon } from '@/components/DropdownWithIcon/DropdownWithIcon';
import { ClearIcon, DownloadIcon, SearchIcon } from '@/utils/icons';
import { BiospecimenEntityType } from './types';
import { useCoreDispatch, useCoreSelector } from '@gen3/core';
import { useBiospecimenDataQuery } from '@/core/cases/bioSpecimanDataSlice';
import { CartFile } from '@/core';
import { handleJSONDownload, handleTSVDownload } from '../cases/utils';

interface BiospecimenProps {
  readonly caseId: string;
  readonly bioId: string;
  readonly isModal?: boolean;
  readonly project_id: string;
  readonly submitter_id: string;
}

export const Biospecimen = ({
  caseId,
  bioId,
  isModal = false,
  project_id,
  submitter_id,
}: BiospecimenProps): JSX.Element => {
  const router = useRouter();
  const [treeStatusOverride, setTreeStatusOverride] =
    useState<overrideMessage | null>(null);
  const [selectedEntity, setSelectedEntity] =
    useState<BiospecimenEntityType>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [expandedCount, setExpandedCount] = useState(1);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [searchText, setSearchText] = useState(bioId || '');
  const [entityClicked, setEntityClicked] = useState(false);

  const selectCart = (a: any) => null; // placeholder to get component to compile Sep 10
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenDataQuery(caseId);

  useEffect(() => {
    setIsAllExpanded(expandedCount === totalNodeCount);
  }, [expandedCount, totalNodeCount]);

  const getType = (node: any) =>
    (entityTypes.find((type) => node[`${type.s}_id`]) || { s: null }).s;

  useDeepCompareEffect(() => {
    if (
      !isBiospecimentDataFetching &&
      bioSpecimenData?.samples?.hits?.edges?.length
    ) {
      const escapedSearchText = escapeRegExp(searchText);
      const founds = bioSpecimenData?.samples?.hits?.edges.map((e: any) => {
        return searchForStringInNode(escapedSearchText, e);
      });
      const flattened = flatten(founds);
      const foundNode =
        flattened.length > 0
          ? (flattened[0] as any).node
          : bioSpecimenData?.samples?.hits?.edges?.[0]?.node;

      if (!entityClicked && foundNode) {
        setSelectedEntity(foundNode);
        setSelectedType(getType(foundNode) as unknown as any);
      }
    }
  }, [
    bioSpecimenData?.samples?.hits?.edges,
    isBiospecimentDataFetching,
    searchText,
    entityClicked,
  ]);

  const onSelectEntity = (entity: any, type: any) => {
    setSearchText('');
    setSelectedEntity(entity);
    setSelectedType(type.s);
    setEntityClicked(true);

    if (treeStatusOverride === overrideMessage.QueryMatches) {
      setTreeStatusOverride(null);
    }

    if (!isModal) {
      router.push(
        {
          query: {
            ...router.query,
            bioId: entity[`${type.s}_id`],
          },
        },
        undefined,
        { shallow: true },
      );
    }
  };

  const supplementalFiles = bioSpecimenData?.files?.hits?.edges || [];
  const withTrimmedSubIds = supplementalFiles.map(({ node }: any) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, '_slide_image'),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity?.submitter_id,
  });

  const downloadFileName = `biospecimen.case-${submitter_id}-${project_id}.${new Date()
    .toISOString()
    .slice(0, 10)}`;
  const handleBiospeciemenTSVDownload = () => {
    const downloadDataColumns = Object.keys(bioSpecimenData).map((key) => ({
      id: key,
      header: key,
    }));
    handleTSVDownload(downloadFileName, [bioSpecimenData], downloadDataColumns);
  };

  const handleBiospeciemenJSONDownload = () => {
    handleJSONDownload(downloadFileName, [bioSpecimenData]);
  };

  // TODO:  Need to add error message in place after this is moved to the Case Summary page
  // for invalid case ids
  return (
    <>
      {isBiospecimentDataFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : selectedEntity &&
        Object.keys(selectedEntity).length > 0 &&
        selectedType !== undefined ? (
        <>
          <div className="mb-2">
            <HeaderTitle>Biospecimen</HeaderTitle>
          </div>

          <DropdownWithIcon
            dropdownElements={[
              {
                title: 'TSV',
                icon: <DownloadIcon size={16} aria-label="download" />,
                onClick: handleBiospeciemenTSVDownload,
              },
              {
                title: 'JSON',
                icon: <DownloadIcon size={16} aria-label="download" />,
                onClick: handleBiospeciemenJSONDownload,
              },
            ]}
            TargetButtonChildren="Download"
            LeftSection={<DownloadIcon size="1rem" aria-label="download" />}
            closeOnItemClick={false}
          />

          <div className="flex mt-2 gap-4">
            <div className="basis-2/5 lg:basis-1/3">
              <div className="flex flex-col lg:flex-row gap-2 mb-4 ">
                <Input
                  data-testid="textbox-biospecimen-search-bar"
                  leftSection={<SearchIcon size={24} aria-hidden="true" />}
                  placeholder="Search"
                  classNames={{
                    wrapper: 'basis-5/6',
                    input: 'border-base-lighter',
                  }}
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setExpandedCount(0);
                      setTreeStatusOverride(overrideMessage.Expanded);
                      router.replace(`/cases/${caseId}`, undefined, {
                        shallow: true,
                      });
                    }
                    if (setEntityClicked) {
                      setEntityClicked(false);
                    }
                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                  rightSectionPointerEvents="all"
                  rightSection={
                    searchText.length > 0 && (
                      <ActionIcon
                        variant="subtle"
                        onClick={() => {
                          setExpandedCount(0);
                          setTreeStatusOverride(overrideMessage.Expanded);
                          setSearchText('');
                          if (setEntityClicked) {
                            setEntityClicked(false);
                          }
                          router.replace(`/cases/${caseId}`, undefined, {
                            shallow: true,
                          });
                        }}
                      >
                        <ClearIcon aria-label="clear search" />
                      </ActionIcon>
                    )
                  }
                />
                <Button
                  onClick={() => {
                    setTreeStatusOverride(
                      isAllExpanded
                        ? overrideMessage.Collapsed
                        : overrideMessage.Expanded,
                    );
                    setExpandedCount(0);
                  }}
                  className={`flex-none text-primary hover:enabled:bg-primary-darker
                   hover:enabled:text-base-lightest font-medium`}
                  disabled={searchText.length > 0}
                  variant="outline"
                >
                  {isAllExpanded ? 'Collapse All' : 'Expand All'}
                </Button>
              </div>
              {!isBiospecimentDataFetching &&
                bioSpecimenData.samples?.hits?.edges.length > 0 && (
                  <BioTree
                    entities={bioSpecimenData.samples}
                    entityTypes={entityTypes}
                    parentNode="root"
                    selectedEntity={selectedEntity}
                    selectEntity={onSelectEntity}
                    type={{
                      p: 'samples',
                      s: 'sample',
                    }}
                    treeStatusOverride={treeStatusOverride}
                    setTreeStatusOverride={setTreeStatusOverride as any}
                    setTotalNodeCount={setTotalNodeCount}
                    setExpandedCount={setExpandedCount}
                    query={searchText.toLocaleLowerCase().trim()}
                    search={searchForStringInNode}
                  />
                )}
            </div>
            <div className="basis-3/5 lg:basis-2/3">
              <HorizontalTable
                customDataTestID="table-selection-information-biospecimen"
                tableData={formatEntityInfo(
                  selectedEntity,
                  selectedType,
                  caseId,
                  dispatch,
                  currentCart as unknown as CartFile[],
                  [selectedSlide],
                )}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
