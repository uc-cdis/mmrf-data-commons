import React, { useCallback, useMemo } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import {
  convertFilterSetToGqlFilter,
  CoreState,
  EmptyFilterSet,
  extractFilterValue as extractValue,
  FilterSet,
  FilterValue as OperandValue,
  GQLIntersection,
  GQLUnion,
  IndexedFilterSet,
  isIncludes,
  Operation,
  selectCohortFilters as selectCurrentCohortFilters,
  selectIndexFilters,
  useCoreSelector,
} from '@gen3/core';
import {
  type SurvivalPlotData,
  useGetGenomicComparisonSurvivalPlotQuery,
} from '@/core/features/survival';
import { useIsDemoApp } from '@/hooks/useIsDemoApp';
import { EmptySurvivalPlot } from '@/core/features/survival/types';
// import { useDeepCompareEffect } from "use-deep-compare";
// import isEqual from "lodash/isEqual";

import {
  AppState,
  useAppDispatch,
  useAppSelector,
} from '@/features/genomic/appApi';
import {
  clearGeneAndSSMFilters,
  removeGeneAndSSMFilter,
  selectGeneAndSSMFilters,
  selectGeneAndSSMFiltersByName,
  selectGeneAndSSMFiltersByNames,
  updateGeneAndSSMFilter,
} from '@/features/genomic/geneAndSSMFiltersSlice';
import {
  selectAllFiltersCollapsed,
  selectFilterExpanded,
  toggleAllFilters,
  toggleFilter,
} from './geneAndSSMFilterExpandedSlice';
import {
  AppModeState,
  ComparativeSurvival,
  GeneSearchTerms,
} from '@/features/genomic/types';
// import { useIsDemoApp } from "@/hooks/useIsDemoApp";
// import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
// import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";
// import { AppModeState, ComparativeSurvival } from "./types";
// import { humanify } from "@/utils/index";
// import { useDeepCompareMemo } from "use-deep-compare";
// import { appendSearchTermFilters } from "@/features/GenomicTables/utils";
import { buildCohortGqlOperator } from '@/core/utils';
import { buildGeneHaveAndHaveNotFilters } from '@/features/genomic/utils';
import { modals } from '@mantine/modals';
import {
  buildSSMSTableSearchFilters,
  COHORT_FILTER_INDEX,
  useGetSsmTableDataMutation,
  useTopGenomicQuery,
} from '@/core';
import {
  addIndexPrefixToGenomicFilterSet,
  addPrefixToFilterSet,
  GenomicIndexFilterPrefixes,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';
import { humanify } from '@/utils';
import { appendSearchTermFilters } from '@/features/GenomicTables/utils';

export const overwritingDemoFilterMutationFrequency: FilterSet = {
  mode: 'and',
  root: {
    'cases.project.project_id': {
      operator: 'includes',
      field: 'cases.project.project_id',
      operands: ['MMRF-COMPASS'],
    },
  },
};

/**
 * Update Genomic Enum Facets filters. These are app local updates and are not added
 * to the current (global) cohort.
 */
export const useUpdateGenomicEnumFacetFilter = () => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateGeneAndSSMFilter({ field: field, operation: operation }));
  };
};

/**
 * clears the genomic (local filters)
 */
export const useClearGenomicFilters = () => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeGeneAndSSMFilter(field));
  };
};

export const useClearAllGenomicFilters = () => {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearGeneAndSSMFilters());
  }, [dispatch]);
};

export const useGenomicFilterByName = (field: string) => {
  return useAppSelector((state: AppState) =>
    selectGeneAndSSMFiltersByName(state, field),
  );
};

export const useGenomicFilterValueByName = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state: AppState) =>
    selectGeneAndSSMFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

const useGenomicFiltersByNames = (
  fields: ReadonlyArray<string>,
): Record<string, OperandValue> => {
  const enumFilters: Record<string, Operation> = useAppSelector(
    (state: AppState) => selectGeneAndSSMFiltersByNames(state, fields),
  );
  return Object.entries(enumFilters).reduce(
    (obj: Record<string, any>, [key, value]) => {
      if (value) obj[key] = extractValue(value);
      return obj;
    },
    {},
  );
};

const useCohortFacetFilter = (): IndexedFilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const useGenomicFacetFilter = (): FilterSet => {
  return useAppSelector((state: AppState) => selectGeneAndSSMFilters(state));
};

export const useToggleExpandFilter = () => {
  const dispatch = useAppDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleFilter({ field, expanded }));
  };
};

export const useToggleAllFilters = () => {
  const dispatch = useAppDispatch();
  return (expanded: boolean) => {
    dispatch(toggleAllFilters(expanded));
  };
};

export const useFilterExpandedState = (field: string) => {
  return useAppSelector((state: AppState) =>
    selectFilterExpanded(state, field),
  );
};

export const useAllFiltersCollapsed = () => {
  return useAppSelector((state: AppState) => selectAllFiltersCollapsed(state));
};

export const useTotalGenomicCounts = () => {
  return 0;
};

export const useGenesFacetValues = (field: string) => {
  // facet data is store in core

  return {
    data: {},
    error: null,
    isLoading: false,
    isSuccess: true,
    isFetching: false,
    isError: false,
  };
};

export const useGenesFacets = (
  index: string,
  fields: ReadonlyArray<string>,
  isDemoMode: boolean,
  indexPrefix?: string,
): void => {};

/**
 * returns the values of a field. Assumes required field
 * is of type Includes. Returns an empty array if filter is undefined or not
 * of type Includes.
 * @param field - to get values of
 */

/**
 * returns the values of a field. Assumes the required field
 * is of type Includes. Returns an empty array if the filter is undefined or not
 * of type Includes.
 * @param field - to get values of
 */
export const useSelectFilterContent = (field: string): Array<string> => {
  const filter = useAppSelector((state: AppState) =>
    selectGeneAndSSMFiltersByNames(state, [field]),
  );
  if (filter === undefined) return [];
  if (isIncludes(filter)) {
    return filter.operands.map((x: any) => x.toString());
  }
  return [];
};

export interface GeneAndSSMPanelData {
  isDemoMode: boolean;
  genomicFilters: FilterSet;
  cohortFilters: IndexedFilterSet;
  overwritingDemoFilter: FilterSet;
  survivalPlotData: SurvivalPlotData;
  survivalPlotFetching: boolean;
  survivalPlotReady: boolean;
}

/*
 * This hook returns the filters, and survival plot data, and it's loading status for the gene and ssm panel.
 */

export const useGeneAndSSMPanelData = (
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
): GeneAndSSMPanelData => {
  const isDemoMode = useIsDemoApp();
  const currentCohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const cohortFilters = currentCohortFilters[COHORT_FILTER_INDEX] ?? [];

  const genomicFilters: FilterSet = useAppSelector((state: AppState) =>
    selectGeneAndSSMFilters(state),
  );
  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const localFilters = useDeepCompareMemo(
    () => buildCohortGqlOperator(genomicFilters),
    [genomicFilters],
  );

  const memoizedFilters = useMemo(() => {
    // merge cohort filters with genomic filters
    const filters = separateGeneAndSSMFilters(genomicFilters);
    const geneForCase = addPrefixToFilterSet(
      filters.gene,
      `${GenomicIndexFilterPrefixes.case.gene}`,
    );
    const ssmForCase = addPrefixToFilterSet(
      filters.ssm,
      `${GenomicIndexFilterPrefixes.case.ssm}`,
    );
    const cohortAndGenomicFilters: FilterSet = {
      mode: 'and',
      root: {
        ...cohortFilters.root,
        ...geneForCase.root,
        ...ssmForCase.root,
      },
    };

    return buildGeneHaveAndHaveNotFilters(
      cohortAndGenomicFilters,
      comparativeSurvival?.symbol,
      comparativeSurvival?.field,
      isGene,
    );
  }, [
    comparativeSurvival?.field,
    comparativeSurvival?.symbol,
    isGene,
    genomicFilters,
  ]);

  const {
    data: survivalPlotData,
    isFetching: survivalPlotFetching,
    isSuccess: survivalPlotReady,
  } = useGetGenomicComparisonSurvivalPlotQuery({
    caseFilter: convertFilterSetToGqlFilter(
      isDemoMode ? overwritingDemoFilter : cohortFilters,
    ),
    genomicFilter: convertFilterSetToGqlFilter(addIndexPrefixToGenomicFilterSet( genomicFilters, 'case')),
    symbol: comparativeSurvival?.symbol,
    type: isGene ? 'gene' : 'ssm',
  });

  return {
    isDemoMode,
    cohortFilters: currentCohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData: survivalPlotData ?? EmptySurvivalPlot,
    survivalPlotFetching,
    survivalPlotReady,
  };
};

/**
 * Hook to set the comparative survival to the top result of the table when the filters, search on the mutation table
 * or app changes
 * @param appMode - current app
 * @param comparativeSurvival - value for what is plotted against the current cohort on survival plot
 * @param setComparativeSurvival - function to set comparative survival
 * @param searchTermsForGene - search filter for the mutation table
 * @returns whether the request for determining the top gene/ssms has successfully completed
 */
export const useTopGeneSsms = ({
  appMode,
  comparativeSurvival,
  setComparativeSurvival,
  searchTermsForGene,
}: {
  appMode: AppModeState;
  comparativeSurvival: ComparativeSurvival;
  setComparativeSurvival: (comparativeSurvival: ComparativeSurvival) => void;
  searchTermsForGene: GeneSearchTerms;
}): boolean => {
  const isDemoMode = useIsDemoApp();

  const cohortFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, COHORT_FILTER_INDEX),
  );

  const genomicFilters: FilterSet = useAppSelector((state: AppState) =>
    selectGeneAndSSMFilters(state),
  );

  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const ssmSearch = searchTermsForGene?.geneSymbol;

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } =
    useTopGenomicQuery({
      cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
      genomicFilters: genomicFilters,
      type: appMode === 'genes' ? 'gene' : 'ssm',
    }); // get the default top gene/ssms to show by default

  // Plot top if new top
  useDeepCompareEffect(() => {
    if (!comparativeSurvival?.setManually && topGeneSSMSSuccess && !ssmSearch) {
      const { genes, ssms } = topGeneSSMS;
      const { name, symbol } = appMode === 'genes' ? genes : ssms;

      if (
        comparativeSurvival !== undefined &&
        comparativeSurvival.symbol === symbol
      ) {
        return;
      }

      if (name === undefined) {
        setComparativeSurvival({
          symbol: '',
          name: '',
          field: '',
        });
        return;
      }

      const { consequence_type, aa_change } = ssms;
      setComparativeSurvival({
        symbol: symbol,
        name:
          appMode === 'genes'
            ? name
            : `${name} ${aa_change ?? ''} ${
                consequence_type
                  ? humanify({
                      term: consequence_type
                        .replace('_variant', '')
                        .replace('_', ' '),
                    })
                  : ''
              }`,
        field: appMode === 'genes' ? 'gene.symbol' : 'gene.ssm.ssm_id',
      });
    }
  }, [
    comparativeSurvival,
    topGeneSSMS,
    topGeneSSMSSuccess,
    appMode,
    setComparativeSurvival,
    ssmSearch,
  ]);

  const [getTopSSM, { data: topSSM, isSuccess: topSSMSuccess }] =
    useGetSsmTableDataMutation();

  useDeepCompareEffect(() => {
    const { geneId = '', geneSymbol = '' } = searchTermsForGene;
    if (searchTermsForGene && appMode === 'ssms') {
      const searchFilters = buildSSMSTableSearchFilters(geneId);
      const tableFilters = appendSearchTermFilters(
        genomicFilters,
        searchFilters ?? { operator: 'or', operands: [] },
      );

      getTopSSM({
        pageSize: 1,
        offset: 0,
        searchTerm: geneId,
        geneSymbol: geneSymbol,
        geneFilters: genomicFilters,
        ssmFilters: genomicFilters,
        cohortFilters: cohortFilters,
        tableFilters,
      });
    }
  }, [
    genomicFilters,
    cohortFilters,
    searchTermsForGene,
    getTopSSM,
    appMode,
    setComparativeSurvival,
  ]);

  // Set top when we've searched on SSM
  useDeepCompareEffect(() => {
    if (topSSMSuccess && ssmSearch) {
      const { ssm_id, consequence_type, aa_change = '' } = topSSM;
      const description = consequence_type
        ? `${searchTermsForGene?.geneSymbol ?? ''} ${aa_change} ${humanify({
            term: consequence_type.replace('_variant', '').replace('_', ' '),
          })}`
        : '';

      setComparativeSurvival({
        symbol: ssm_id,
        name: description,
        field: 'gene.ssm.ssm_id',
      });
    }
  }, [
    topGeneSSMSSuccess,
    topSSM,
    setComparativeSurvival,
    searchTermsForGene,
    ssmSearch,
    topSSMSuccess,
  ]);

  return ssmSearch ? topSSMSuccess : topGeneSSMSSuccess;
};

export const useOpenUploadModal = () => {
  const updateFacetFilters = useUpdateGenomicEnumFacetFilter();
  const updateFilters = (field: string, ids: string[]) => {
    updateFacetFilters(field, {
      field: field,
      operator: 'in',
      operands: ids,
    });
  };

  const openUploadModal = (field: string) => {
    if (field === 'gene_id') {
      modals.openContextModal({
        modal: 'filterByUserInputModal',
        title: 'Filter Mutation Frequency by Mutated Genes',
        size: 'xl',
        innerProps: {
          userInputProps: {
            inputInstructions:
              'Enter one or more gene identifiers in the field below or upload a file to filter Mutation Frequency.',
            textInputPlaceholder:
              'e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637',
            entityType: 'genes',
            entityLabel: 'gene',
            identifierToolTip: (
              <div>
                <p>
                  - Gene identifiers accepted: Symbol, Ensembl, Entrez, HCNC,
                  UniProtKB/Swiss-Prot, OMIM
                </p>
                <p>
                  - Delimiters between gene identifiers: comma, space, tab or 1
                  gene identifier per line
                </p>
                <p>- File formats accepted: .txt, .csv, .tsv</p>
              </div>
            ),
          },
          updateFilters,
          type: 'genes',
        },
      });
    } else if (field === 'ssm_id') {
      modals.openContextModal({
        modal: 'filterByUserInputModal',
        title: 'Filter Mutation Frequency by Somatic Mutations',
        size: 'xl',
        innerProps: {
          userInputProps: {
            inputInstructions:
              'Enter one or more mutation identifiers in the field below or upload a file to filter Mutation Frequency.',
            textInputPlaceholder:
              'e.g. ENSG00000141510, TP53, 7273, HGNC:11998, 191170, P04637',
            entityType: 'ssms',
            entityLabel: 'mutation',
            identifierToolTip: (
              <div>
                <p>
                  - Mutation identifiers accepted: Mutation UUID, DNA Change
                </p>
                <p>
                  - Delimiters between mutation identifiers: comma, space, tab
                  or 1 mutation identifier per line
                </p>
                <p>- File formats accepted: .txt, .csv, .tsv</p>
              </div>
            ),
          },
          updateFilters,
          type: 'ssms',
        },
      });
    }
  };

  return openUploadModal;
};

export const useUploadFilterItems = (field: string) => {
  const items = useGenomicFilterValueByName(field);
  return { items, noData: items === undefined };
};
