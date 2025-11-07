import React, { useCallback, useState } from 'react';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';
import { Tabs } from '@mantine/core';
import {
  FilterSet,
  removeCohortFilter,
  updateCohortFilter as updateActiveCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  selectCurrentCohortId
} from '@gen3/core';
import { useAppDispatch } from "@/features/genomic/appApi";
import { clearGeneAndSSMFilters } from "@/features/genomic/geneAndSSMFiltersSlice";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { AppModeState, ComparativeSurvival } from './types';
import { TableXPositionContext } from '@/components/Table/VerticalTable';
import { SecondaryTabStyle } from './constants';
import { GenesPanel } from './GenesPanel';
import { SSMSPanel } from './SSMSPanel';
import GeneAndSSMFilterPanel from '@/features/genomic/GeneAndSSMFilterPanel';
import { AppState, useAppSelector } from '@/features/genomic/appApi';
import { selectGeneAndSSMFilters } from '@/features/genomic/geneAndSSMFiltersSlice';
import { useTopGeneSsms } from '@/features/genomic/hooks';
import { GeneSearchTerms } from '@/features/genomic/types';

export const overwritingDemoFilterMutationFrequency: FilterSet = {
  mode: 'and',
  root: {
    'cases.project.project_id': {
      operator: 'includes',
      field: 'cases.project.project_id',
      operands: ['TCGA-LGG'],
    },
  },
};

const GenesAndMutationFrequencyAnalysisTool = () => {
  const isDemoMode = useIsDemoApp();
  const coreDispatch = useCoreDispatch();
   const appDispatch = useAppDispatch();
  const [comparativeSurvival, setComparativeSurvival] =
    useState<ComparativeSurvival>({
      symbol: '',
      name: '',
      field: '',
    });
  const [appMode, setAppMode] = useState<AppModeState>('genes');
  const [searchTermsForGeneId, setSearchTermsForGeneId] =
    useState<GeneSearchTerms>({
      geneId: '',
      geneSymbol: '',
    });

  const genomicFilters: FilterSet = useAppSelector((state: AppState) =>
    selectGeneAndSSMFilters(state),
  );

  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  const prevId = usePrevious(cohortId);

  // clear local filters when cohort changes or tabs change
  useDeepCompareEffect(() => {
    if (cohortId !== prevId) {
      appDispatch(clearGeneAndSSMFilters());
    }
  }, [cohortId, prevId, appDispatch]);

  const topGeneSSMSSuccess = useTopGeneSsms({
    appMode,
    comparativeSurvival,
    setComparativeSurvival,
    searchTermsForGene: searchTermsForGeneId,
  });

  /**
   * Update the survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined, it will show the
   * plot for the currentCohort plus whatever local filters are selected for the "top"
   * gene or mutation.
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol - symbol (Gene or SSMS) to compare
   * @param name - used as the label for the symbol in the Survival Plot
   * @param field - which gene or ssms field the symbol applied to
   */
  const handleSurvivalPlotToggled = useDeepCompareCallback(
    (symbol: string, name: string, field: string) => {
      if (comparativeSurvival && comparativeSurvival?.symbol === symbol) {
        setComparativeSurvival({
          symbol: '',
          name: '',
          field: '',
        });
      } else {
        setComparativeSurvival({
          symbol: symbol,
          name: name,
          field: field,
          setManually: true,
        });
      }
    },
    [comparativeSurvival],
  );

  const handleGeneAndSSmToggled = useCallback(
    (
      cohortStatus: string[],
      field: string,
      idField: string,
      payload: Record<string, any>,
    ) => {
      if (cohortStatus.includes(payload[idField])) {
        // remove the id from the cohort
        const update = cohortStatus.filter((x) => x != payload[idField]);
        if (update.length > 0)
          coreDispatch(
            updateActiveCohortFilter({
              field: field,
              index: 'case',
              filter: {
                field: field,
                operator: 'includes',
                operands: update,
              },
            }),
          );
        else coreDispatch(removeCohortFilter({ index: 'case', field }));
      } else
        coreDispatch(
          updateActiveCohortFilter({
            field: field,
            index: 'case',
            filter: {
              field: field,
              operator: 'includes',
              operands: [...cohortStatus, payload[idField]],
            },
          }),
        );
    },
    [coreDispatch],
  );

  /**
   * remove comparative survival plot when tabs or filters change.
   */
  const handleTabChanged = useCallback(
    (tabKey: string | null) => {
      setAppMode(tabKey as AppModeState);
      setComparativeSurvival({
        symbol: '',
        name: '',
        field: '',
      });
      if (searchTermsForGeneId.geneId || searchTermsForGeneId.geneSymbol) {
        setSearchTermsForGeneId({ geneId: undefined, geneSymbol: undefined });
      }
    },
    [searchTermsForGeneId.geneId, searchTermsForGeneId.geneSymbol],
  );

  const handleMutationCountClick = useCallback(
    (geneId: string, geneSymbol: string) => {
      setAppMode('ssms');
      setSearchTermsForGeneId({ geneId: geneId, geneSymbol: geneSymbol });
    },
    [],
  );

  const clearSearchTermsForGene = useCallback(() => {
    setSearchTermsForGeneId({ geneId: undefined, geneSymbol: undefined });
  }, [setSearchTermsForGeneId]);

  const [tableXPosition, setTableXPosition] = useState<number | undefined>(
    undefined,
  );

  return (
    <div>
      <TableXPositionContext.Provider
        value={{ xPosition: tableXPosition, setXPosition: setTableXPosition }}
      >
        <div className="flex gap-4 m-4">
          <div
            id="mutation-frequency-analysis-tool-filters"
            data-testid="mutation-frequency-analysis-tool-filters"
            className="flex-shrink-0 md:w-1/5 lg:w-1/6"
          >
            <GeneAndSSMFilterPanel />
          </div>
          <Tabs
            variant="pills"
            value={appMode}
            defaultValue="genes"
            classNames={{
              tab: SecondaryTabStyle,
              list: 'mt-2 border-0 gap-0 mb-2',
              root: 'bg-base-max border-0 w-full overflow-x-hidden',
            }}
            onChange={handleTabChanged}
            keepMounted={false}
          >
            <Tabs.List>
              <Tabs.Tab data-testid="button-genes-tab" value="genes">
                Genes
              </Tabs.Tab>
              <Tabs.Tab data-testid="button-mutations-tab" value="ssms">
                Mutations
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="genes" pt="xs">
              <GenesPanel
                topGeneSSMSSuccess={topGeneSSMSSuccess}
                comparativeSurvival={comparativeSurvival as ComparativeSurvival}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                handleGeneAndSSmToggled={handleGeneAndSSmToggled}
                handleMutationCountClick={handleMutationCountClick}
              />
            </Tabs.Panel>
            <Tabs.Panel value="ssms" pt="xs">
              <SSMSPanel
                topGeneSSMSSuccess={topGeneSSMSSuccess}
                comparativeSurvival={comparativeSurvival as ComparativeSurvival}
                handleSurvivalPlotToggled={handleSurvivalPlotToggled}
                handleGeneAndSSmToggled={handleGeneAndSSmToggled}
                searchTermsForGene={searchTermsForGeneId}
                clearSearchTermsForGene={clearSearchTermsForGene}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </TableXPositionContext.Provider>
    </div>
  );
};

export default GenesAndMutationFrequencyAnalysisTool;
