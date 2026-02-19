import React, { Dispatch, SetStateAction, useId } from 'react';
import { ComparativeSurvival } from '@/features/genomic/types';
import { Gene, GeneRowInfo, GeneToggledHandler } from './types';
import { entityMetadataType } from '@/utils/contexts';
import { FilterSet } from '@gen3/core';
import { CnvChange } from '@/core/genomic/genesTableSlice';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Checkbox, Tooltip } from '@mantine/core';
import { HeaderTooltip } from '@/components/Table/HeaderTooltip';
import NumeratorDenominator from '@/components/NumeratorDenominator';
import CohortCreationButton from '@/components/CohortCreationButton';
import { CollapseCircleIcon, ExpandCircleIcon } from '@/utils/icons';
import RatioWithSpring from '@/components/RatioWithSpring';
import { Image } from '@/components/Image';
import GenesTableCohort from './TableComponents/GenesTableCohort';
import { CountButton } from './CountButton';
import GenesTableSurvival from './TableComponents/GenesTableSurvival';
import Link from 'next/link';

const genesTableColumnHelper: any = createColumnHelper<Gene>();

export const useGenerateGenesTableColumns = ({
  handleSurvivalPlotToggled,
  handleGeneToggled,
  toggledGenes,
  isDemoMode,
  setEntityMetadata,
  cohortFilters,
  genomicFilters,
  generateFilters,
  handleMutationCountClick,
  currentPage,
  totalPages,
  rowSelectionEnabled = false,
}: {
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  toggledGenes: ReadonlyArray<string>;
  isDemoMode: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
  cohortFilters: FilterSet | any;
  genomicFilters: FilterSet | any;
  generateFilters: (
    cnvType: CnvChange | undefined,
    geneId: string,
  ) => FilterSet;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  currentPage: number;
  totalPages: number;
  rowSelectionEnabled?: boolean;
}): ColumnDef<Gene>[] => {
  const componentId = useId();

  return useDeepCompareMemo<ColumnDef<Gene>[]>(
    () => [
      ...(rowSelectionEnabled
        ? [
            genesTableColumnHelper.display({
              id: 'select',
              header: ({ table }: any) => (
                <Checkbox
                  size="xs"
                  classNames={{
                    input: 'checked:bg-accent checked:border-accent',
                    label: 'sr-only',
                  }}
                  label={`Select all gene rows on page ${currentPage} of ${totalPages}`}
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                />
              ),
              cell: ({ row }: any) => (
                <Checkbox
                  size="xs"
                  classNames={{
                    input:
                      'checked:bg-accent checked:border-accent gene-panel-table-row-select',
                  }}
                  aria-label={row.original.symbol}
                  {...{
                    checked: row.getIsSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              ),
              enableHiding: false,
            }),
          ]
        : []),
      genesTableColumnHelper.display({
        id: 'cohort',
        header: () => (
          <HeaderTooltip
            title="Cohort"
            tooltip="Add/remove mutated (SSM/CNV) genes to/from your cohort filters"
          />
        ),
        cell: ({ row }: any) => (
          <>
            <GenesTableCohort
              toggledGenes={toggledGenes}
              geneID={row.original.gene_id}
              isDemoMode={isDemoMode}
              cohort={row.original.cohort}
              handleGeneToggled={handleGeneToggled}
              symbol={row.original.symbol}
            />
          </>
        ),
      }),
      genesTableColumnHelper.display({
        id: 'survival',
        header: () => (
          <HeaderTooltip
            title="Survival"
            tooltip="Change the survival plot display"
          />
        ),
        cell: ({ row }: any) => (
          <GenesTableSurvival
            SSMSAffectedCasesInCohort={
              row.original['#_ssm_affected_cases_in_cohort']
            }
            survival={row.original.survival}
            handleSurvivalPlotToggled={handleSurvivalPlotToggled}
            symbol={row.original.symbol}
          />
        ),
      }),
      genesTableColumnHelper.accessor('gene_id', {
        id: 'gene_id',
        header: 'Gene ID',
      }),
      genesTableColumnHelper.display({
        id: 'symbol',
        header: 'Symbol',
        cell: ({ row }: any) => (
          <Link
            href={`genes/${row.original.gene_id}`}
            target="_blank"
            rel="noreferrer"
            className="text-utility-link underline"
          >
            {row.original.symbol}
          </Link>
        ),
      }),
      genesTableColumnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
      genesTableColumnHelper.display({
        id: 'cytoband',
        header: 'Cytoband',
        cell: ({ row }: any) => (
          <div className="flex flex-col items-center">
            {row.original.cytoband.map((cytoband: any, key: any) => {
              return (
                <div key={`cytoband-${key}`} className="my-0.5">
                  {cytoband}
                </div>
              );
            })}
          </div>
        ),
      }),
      genesTableColumnHelper.accessor('type', {
        id: 'type',
        header: 'Type',
      }),
      genesTableColumnHelper.display({
        id: '#_ssm_affected_cases_in_cohort',
        header: () => (
          <HeaderTooltip
            title={`# SSM Affected Cases
          in Cohort`}
            tooltip={`Breakdown of Affected Cases in Cohort:
           # Cases where Gene is mutated / # Cases tested for Simple Somatic Mutations`}
          />
        ),
        cell: ({ row }: any) => (
          <CohortCreationButton
            label={
              <NumeratorDenominator
                numerator={
                  row.original['#_ssm_affected_cases_in_cohort'].numerator
                }
                denominator={
                  row.original['#_ssm_affected_cases_in_cohort'].denominator
                }
                boldNumerator={true}
              />
            }
            numCases={row.original['#_ssm_affected_cases_in_cohort'].numerator}
            filter={generateFilters(undefined, row.original.gene_id)}
            caseFilter={cohortFilters}
          />
        ),
      }),
      genesTableColumnHelper.display({
        id: '#_ssm_affected_cases_across_the_mmrf',
        header: () => (
          <HeaderTooltip
            title={`# SSM Affected Cases
          Across MMRF`}
            tooltip={`# Cases where Gene contains Simple Somatic Mutations / # Cases tested for Simple Somatic Mutations portal wide.`}
          />
        ),
        cell: ({ row }: any) => {
          const { numerator, denominator } = row?.original[
            '#_ssm_affected_cases_across_the_mmrf'
          ] ?? { numerator: 0, denominator: 1 };

          if (!row.getCanExpand()) {
            return (
              <NumeratorDenominator
                numerator={numerator}
                denominator={denominator}
              />
            );
          } else {
            return (
              <div
                className={`flex items-center gap-2 ${
                  numerator !== 0 && 'cursor-pointer'
                }`}
              >
                {numerator !== 0 && row.getCanExpand() && (
                  <div className="flex items-center">
                    {!row.getIsExpanded() ? (
                      <ExpandCircleIcon size="1.25em" className="text-accent" />
                    ) : (
                      <CollapseCircleIcon
                        size="1.25em"
                        className="text-accent"
                      />
                    )}
                  </div>
                )}
                {row.getCanExpand() && (
                  <RatioWithSpring
                    index={0}
                    item={{ numerator, denominator }}
                  />
                )}
              </div>
            );
          }
        },
      }),
      genesTableColumnHelper.display({
        id: '#_cnv_amplifications',
        header: () => (
          <HeaderTooltip
            title="# CNV Amplifications"
            tooltip={
              '# Cases where CNV amplifications are observed in Gene / # Cases tested for Copy Number Variations in Gene'
            }
          />
        ),
        cell: ({ row }: any) => {
          const { numerator, denominator } = row.original[
            '#_cnv_amplifications'
          ] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <NumeratorDenominator
              numerator={numerator}
              denominator={denominator}
              boldNumerator={true}
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: '#_cnv_gains',
        header: () => (
          <HeaderTooltip
            title="# CNV Gains"
            tooltip={
              '# Cases where CNV gains are observed in Gene / # Cases tested for Copy Number Variations in Gene'
            }
          />
        ),
        cell: ({ row }: any) => {
          const { numerator, denominator } = row.original['#_cnv_gains'] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <NumeratorDenominator
              numerator={numerator}
              denominator={denominator}
              boldNumerator={true}
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: '#_cnv_loss',
        header: () => (
          <HeaderTooltip
            title="# CNV Losses"
            tooltip={
              '# Cases where CNV losses are observed in Gene / # Cases tested for Copy Number Variations in Gene'
            }
          />
        ),
        cell: ({ row }: any) => {
          const { numerator, denominator } = row.original['#_cnv_loss'] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <NumeratorDenominator
              numerator={numerator}
              denominator={denominator}
              boldNumerator={true}
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: '#_cnv_homozygous_deletions',
        header: () => (
          <HeaderTooltip
            title="# CNV Homozygous Deletions"
            tooltip={
              '# Cases where CNV homozygous deletions are observed in Gene / # Cases tested for Copy Number Variations in Gene'
            }
          />
        ),
        cell: ({ row }: any) => {
          const { numerator, denominator } = row.original[
            '#_cnv_homozygous_deletions'
          ] ?? {
            numerator: 0,
            denominator: 1,
          };
          return (
            <NumeratorDenominator
              numerator={numerator}
              denominator={denominator}
              boldNumerator={true}
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: '#_mutations',
        header: () => (
          <HeaderTooltip
            title="# Mutations"
            tooltip="# Unique Simple Somatic Mutations in the Gene in Cohort"
          />
        ),
        cell: ({ row }: any) => {
          const count = row.original['#_mutations'] ?? 0;
          const disabled = Number(count) === 0;
          return (
            <CountButton
              tooltipLabel={
                count === 0
                  ? `No SSMs in ${row?.original?.symbol}`
                  : `Search the mutations table for ${row?.original?.symbol}`
              }
              disabled={disabled}
              handleOnClick={() => {
                handleMutationCountClick(
                  row?.original?.gene_id ?? '',
                  row?.original?.symbol ?? '',
                );
              }}
              count={
                Number(count) !== 0 ? parseInt(count.replace(/,/g, ''), 10) : 0
              }
            />
          );
        },
      }),
      genesTableColumnHelper.display({
        id: 'annotations',
        header: 'Annotations',
        cell: ({ row }: any) => (
          <Tooltip label="Cancer Gene Census">
            <span>
              {row.original.annotations && (
                <Image
                  src="/icons/AnnotationsIcon.svg"
                  height={20}
                  width={20}
                  alt=""
                />
              )}
            </span>
          </Tooltip>
        ),
      }),
    ],
    [
      setEntityMetadata,
      genomicFilters,
      handleGeneToggled,
      handleMutationCountClick,
      isDemoMode,
      toggledGenes,
      generateFilters,
      handleSurvivalPlotToggled,
      componentId,
      currentPage,
      totalPages,
      cohortFilters,
    ],
  );
};

export const getGene = (
  g: GeneRowInfo,
  selectedSurvivalPlot: ComparativeSurvival,
  ssmCases: number,
  totalCases: number,
  cnvCases: number,
): Gene => {
  return {
    gene_id: g.gene_id,
    survival: {
      label: g.symbol,
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    cohort: {
      checked: true,
    },
    symbol: g.symbol,
    name: g.name,
    type: g.biotype,
    cytoband: g.cytoband,
    '#_ssm_affected_cases_in_cohort': {
      numerator: g.case_count,
      denominator: ssmCases,
    },
    '#_ssm_affected_cases_across_the_mmrf': {
      numerator: g.ssm_cases_across_commons,
      denominator: totalCases,
    },
    '#_cnv_amplifications': {
      numerator: g.cnv_count_amplification,
      denominator: cnvCases,
    },
    '#_cnv_gains': {
      numerator: g.cnv_count_gain,
      denominator: cnvCases,
    },
    '#_cnv_loss': {
      numerator: g.cnv_count_loss,
      denominator: cnvCases,
    },
    '#_cnv_homozygous_deletions': {
      numerator: g.cnv_count_homozygous_deletion,
      denominator: cnvCases,
    },
    '#_mutations': g?.ssm_count?.toLocaleString() ?? '0',
    annotations: g.is_cancer_gene_census,
  };
};
