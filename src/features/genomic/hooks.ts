import {  useCallback, useMemo } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  FacetBucket as FacetBuckets,
  FilterSet,
  IndexedFilterSet,
  Operation,
  CoreState,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  selectCohortFilters as selectCurrentCohortFilters,
  GQLFilter as GqlOperation,
  extractFilterValue as extractValue,
  FilterValue as OperandValue,
  GQLFilter,
} from '@gen3/core';
import {
  type SurvivalPlotData,
  useGetComparisonSurvivalPlotQuery,
} from '@/core/survival';
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { EmptySurvivalPlot } from "@/core/survival/types";

export const overwritingDemoFilterMutationFrequency: FilterSet = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["MMRF-COMPASS"],
    },
  },
};

// import { useDeepCompareEffect } from "use-deep-compare";
// import isEqual from "lodash/isEqual";
import { GQLDocType, GQLIndexType} from '@/core/features/facets/types';

import { AppState, useAppDispatch, useAppSelector } from '@/features/genomic/appApi';
import {
  updateGeneAndSSMFilter,
  selectGeneAndSSMFiltersByName,
  selectGeneAndSSMFilters,
  removeGeneAndSSMFilter,
  selectGeneAndSSMFiltersByNames,
  clearGeneAndSSMFilters,
} from "@/features/genomic/geneAndSSMFiltersSlice";
import {
  toggleFilter,
  toggleAllFilters,
  selectFilterExpanded,
  selectAllFiltersCollapsed,
} from "./geneAndSSMFilterExpandedSlice";
import { ComparativeSurvival } from '@/features/genomic/types';
// import { useIsDemoApp } from "@/hooks/useIsDemoApp";
// import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
// import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";
// import { AppModeState, ComparativeSurvival } from "./types";
// import { humanify } from "@/utils/index";
// import { useDeepCompareMemo } from "use-deep-compare";
// import { appendSearchTermFilters } from "@/features/GenomicTables/utils";
import FilterFacets from "@/features/genomic/filters";
import { buildCohortGqlOperator } from '@/core/utils';
import { buildGeneHaveAndHaveNotFilters } from '@/features/genomic/utils';
// import { buildCohortGqlOperator } from '@/core/utils';

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
  return useAppSelector((state: AppState) => selectGeneAndSSMFiltersByName(state, field));
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
  const enumFilters: Record<string, Operation> = useAppSelector((state: AppState) =>
    selectGeneAndSSMFiltersByNames(state, fields),
  );
  return Object.entries(enumFilters).reduce((obj : Record<string, any>, [key, value]) => {
    if (value) obj[key] = extractValue(value);
    return obj;
  }, {});
};

const useCohortFacetFilter = (): IndexedFilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const useGenomicFacetFilter = (): FilterSet => {
  return useAppSelector((state : AppState) => selectGeneAndSSMFilters(state));
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
  return useAppSelector((state: AppState) => selectFilterExpanded(state, field));
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
): void => {
};

/**
 * returns the values of a field. Assumes required field
 * is of type Includes. Returns an empty array if filter is undefined or not
 * of type Includes.
 * @param field - to get values of
 */
export const useSelectFilterContent = (field: string): Array<string> => {
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

const genomicFilters: FilterSet = useAppSelector((state:AppState) =>
  selectGeneAndSSMFilters(state),
);
const overwritingDemoFilter = useMemo(
  () => overwritingDemoFilterMutationFrequency,
  [],
);

const cohortFilters: GqlOperation = useDeepCompareMemo(
  () =>
    buildCohortGqlOperator(
      isDemoMode ? overwritingDemoFilter : currentCohortFilters['case'], // TODO: handle multiple cohorts
    ) ?? { and :[]},
  [currentCohortFilters, isDemoMode, overwritingDemoFilter],
);

const localFilters = useDeepCompareMemo(
  () => buildCohortGqlOperator(genomicFilters),
  [genomicFilters],
);

const memoizedFilters = useMemo(
  () =>
    buildGeneHaveAndHaveNotFilters(
      buildCohortGqlOperator(genomicFilters),
      comparativeSurvival?.symbol,
      comparativeSurvival?.field,
      isGene,
    ),
  [
    comparativeSurvival?.field,
    comparativeSurvival?.symbol,
    isGene,
    genomicFilters,
  ],
);

const {
  data: survivalPlotData,
  isFetching: survivalPlotFetching,
  isSuccess: survivalPlotReady,
} = useGetComparisonSurvivalPlotQuery({
  filters:
    comparativeSurvival !== undefined
      ? memoizedFilters
      : localFilters
      ? [localFilters]
      : [],
  index: "CaseCentric_case_centric",
  field: "case_id",
  useIntersection: false
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
/* ---- TODO: implement when APIs are ready
export const useTopGeneSsms = ({
 appMode,
 comparativeSurvival,
 setComparativeSurvival,
 searchTermsForGene,
}: {
 appMode: AppModeState;
 comparativeSurvival: ComparativeSurvival;
 setComparativeSurvival: (comparativeSurvival: ComparativeSurvival) => void;
 searchTermsForGene: { geneId: string; geneSymbol: string };
}): boolean => {

 const isDemoMode = useIsDemoApp();

 const cohortFilters = useCoreSelector((state) =>
   selectCurrentCohortFilters(state),
 );

 const genomicFilters: FilterSet = useAppSelector((state: AppState) =>
   selectGeneAndSSMFilters(state),
 );

 const overwritingDemoFilter = useMemo(
   () => overwritingDemoFilterMutationFrequency,
   [],
 );

 const ssmSearch = searchTermsForGene?.geneSymbol;

 const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGeneQuery({
   cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
   genomicFilters: genomicFilters,
 }); // get the default top gene/ssms to show by default

 // Plot top if new top
 useDeepCompareEffect(() => {
   if (!comparativeSurvival?.setManually && topGeneSSMSSuccess && !ssmSearch) {
     const { genes, ssms } = topGeneSSMS;
     const { name, symbol } = appMode === "genes" ? genes : ssms;

     if (
       comparativeSurvival !== undefined &&
       comparativeSurvival.symbol === symbol
     ) {
       return;
     }

     if (name === undefined) {
       setComparativeSurvival(undefined);
       return;
     }

     const { consequence_type, aa_change } = ssms;
     setComparativeSurvival({
       symbol: symbol,
       name:
         appMode === "genes"
           ? name
           : `${name} ${aa_change ?? ""} ${
               consequence_type
                 ? humanify({
                     term: consequence_type
                       .replace("_variant", "")
                       .replace("_", " "),
                   })
                 : ""
             }`,
       field: appMode === "genes" ? "gene.symbol" : "gene.ssm.ssm_id",
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
   const { geneId = "", geneSymbol = "" } = searchTermsForGene;
   if (searchTermsForGene && appMode === "ssms") {
     const searchFilters = buildSSMSTableSearchFilters(geneId);
     const tableFilters = appendSearchTermFilters(
       genomicFilters,
       searchFilters,
     );

     getTopSSM({
       pageSize: 1,
       offset: 0,
       searchTerm: geneId,
       geneSymbol: geneSymbol,
       genomicFilters: genomicFilters,
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
     const { ssm_id, consequence_type, aa_change = "" } = topSSM;
     const description = consequence_type
       ? `${searchTermsForGene?.geneSymbol ?? ""} ${aa_change} ${humanify({
           term: consequence_type.replace("_variant", "").replace("_", " "),
         })}`
       : "";

     setComparativeSurvival({
       symbol: ssm_id,
       name: description,
       field: "gene.ssm.ssm_id",
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
  */
export const useOpenUploadModal = () => {
  /* Gen3  uses a different modal system will update later */
  /* ---- TODO: update to use Gen3 modal system
  const coreDispatch = useCoreDispatch();
  const openUploadModal = (field: string) => {
    if (field === "genes.upload.gene_id") {
      coreDispatch(showModal({ modal: Modals.LocalGeneSetModal }));
    } else if (field === "ssms.upload.ssm_id") {
      coreDispatch(showModal({ modal: Modals.LocalMutationSetModal }));
    }
  };

  return openUploadModal;
  */
  return () => {};
};

export const useUploadFilterItems = (uploadField: string) => {
  const field = uploadField.split(".upload").join("");
  const items = useGenomicFilterValueByName(field);
  return { items, noData: items === undefined };
};
