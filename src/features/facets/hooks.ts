
import { NumericFromTo} from '@gen3/frontend';
import { GqlOperation } from "@/core/types";

const EmptyRangeFacetResponse = {
  buckets: { },
  error: undefined,
  status: "fulfilled"
};

export interface UseRangeFacetResponse {
  data: Record<string, number>;
  error: any;
  isUninitialized: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useRangeFacet = (
  field: string,
  ranges: ReadonlyArray<NumericFromTo>,
  { indexType }: {indexType: string },
  overrideCohortFilters?: GqlOperation,
) :  UseRangeFacetResponse => {
  // const coreDispatch = useCoreDispatch();
  // const facet: FacetBuckets = useCoreSelector((state) =>
  //   selectRangeFacetByField(state, field),
  // );
  //
  // const cohortFilters = useCohortFacetFilter();
  // const prevFilters = usePrevious(cohortFilters);
  // const prevRanges = usePrevious(ranges);
  //
  // const rangeCohortFilters = useMemo(
  //   () => overrideCohortFilters ?? buildCohortGqlOperator(cohortFilters),
  //   [overrideCohortFilters, cohortFilters],
  // );
  // const prevRangeFilters = usePrevious(rangeCohortFilters);
  //
  // useEffect(() => {
  //   if (
  //     !facet ||
  //     !isEqual(prevRangeFilters, rangeCohortFilters) ||
  //     !isEqual(ranges, prevRanges)
  //   ) {
  //     coreDispatch(
  //       fetchFacetContinuousAggregation({
  //         field: field,
  //         ranges: ranges,
  //         docType: docType,
  //         indexType: indexType,
  //         overrideFilters: rangeCohortFilters,
  //       }),
  //     );
  //   }
  // }, [
  //   coreDispatch,
  //   facet,
  //   field,
  //   rangeCohortFilters,
  //   prevFilters,
  //   prevRangeFilters,
  //   ranges,
  //   prevRanges,
  //   indexType,
  // ]);

  const facet = EmptyRangeFacetResponse;

  return {
    data: facet?.buckets,
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};
