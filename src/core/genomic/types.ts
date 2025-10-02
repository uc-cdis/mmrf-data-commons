import { FilterSet, TablePageOffsetProps } from "@gen3/core";

export interface GenomicTableProps extends TablePageOffsetProps {
  genesTableFilters: FilterSet;
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
}
