import { FilterSet, TablePageOffsetProps } from "@gen3/core";

export interface GenomicTableProps extends TablePageOffsetProps {
  genesTableFilters: FilterSet;
  geneFilters: FilterSet;
  ssmFilters: FilterSet;
  cohortFilters: FilterSet;
}

export interface SsmsTableRequestParameters extends GenomicTableProps {
  readonly geneSymbol?: string;
  readonly tableFilters: FilterSet;
  readonly _cohortFiltersNoSet?: FilterSet;
}
