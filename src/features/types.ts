import { Accessibility, AggregationsData, FilterSet, GQLFilter } from '@gen3/core';

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }
  | JSX.Element;

export interface JSONObject {
  [k: string]: JSONValue;
}
export type JSONArray = Array<JSONValue>;

export interface DocumentWithWebkit extends Document {
  readonly webkitExitFullscreen: () => void;
  readonly webkitFullscreenElement: Element;
}
export interface FacetQueryParameters {
  filter: FilterSet;
}

export interface FacetQueryParametersWithCohortFilter extends FacetQueryParameters {
  cohortFilter: GQLFilter;
}

export interface FacetQueryResponse {
  data: AggregationsData;
  isSuccess: boolean;
  isFetching: boolean;
  isError: boolean;
}

export interface CohortCentricAggsQueryRequest {
  type: string;
  cohortFilter: GQLFilter;
  fields: Array<string>;
  filter: FilterSet;
  caseIdsFilterPath: string;
  accessibility?: Accessibility;
  filterSelf?: boolean;
  indexPrefix?: string;
}
