import React from 'react';
// This table can be found at /analysis_page?app=MutationFrequencyApp Mutations tab
import { humanify } from '@/utils/index';
import {  FilterSet } from '@/core';
import { SomaticMutation, SsmToggledHandler } from '../types';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useId } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { HeaderTooltip } from '@/components/Table/HeaderTooltip';
import {
  SMTableConsequences,
  SMTableDNAChange,
  SMTableImpacts,
  SMTableProteinChange,
} from '../TableComponents';
import { entityMetadataType } from '@/utils/contexts';
import NumeratorDenominator from '@/components/NumeratorDenominator';
import ImpactHeaderWithTooltip from '../../SharedComponent/ImpactHeaderWithTooltip';
import RatioWithSpring from '@/components/RatioWithSpring';
import { ComparativeSurvival } from '@/features/genomic/types';
import { CollapseCircleIcon, ExpandCircleIcon } from '@/utils/icons';

export const filterMutationType = (mutationSubType: string): string => {
  if (
    ['Oligo-nucleotide polymorphism', 'Tri-nucleotide polymorphism'].includes(
      mutationSubType,
    )
  )
    return mutationSubType;
  const split = mutationSubType.split(' ');
  const operation = split[split.length - 1];
  return operation.charAt(0).toUpperCase() + operation.slice(1);
};

const SMTableColumnHelper = createColumnHelper<SomaticMutation>();

type HandleSurvivalPlotToggledType = (
  symbol: string,
  name: string,
  field: string,
) => void;
export const useGenerateSMTableColumns = ({
  toggledSsms,
  isDemoMode,
  handleSsmToggled,
  handleSurvivalPlotToggled,
  isModal,
  geneSymbol,
  setEntityMetadata,
  projectId,
  generateFilters,
  currentPage,
  totalPages,
  cohortFilters,
}: {
  toggledSsms: string[] | undefined;
  isDemoMode: boolean;
  handleSsmToggled: SsmToggledHandler | undefined;
  handleSurvivalPlotToggled: HandleSurvivalPlotToggledType | undefined;
  isModal: boolean;
  geneSymbol: string | undefined;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>> | null;
  projectId: string | undefined;
  generateFilters: (ssmId: string) => FilterSet | null;
  currentPage: number;
  totalPages: number;
  cohortFilters: FilterSet;
}): ColumnDef<SomaticMutation>[] => {
  const componentId = useId();

  const SMTableDefaultColumns = useDeepCompareMemo<
    any
  >(
    () => [
      SMTableColumnHelper.accessor('mutation_id', {
        id: 'mutation_id',
        header: 'Mutation ID',
      }),

      SMTableColumnHelper.display({
        id: 'dna_change',
        header: () => (
          <HeaderTooltip
            title="DNA Change"
            tooltip={`Genomic DNA Change, shown as
               {chromosome}:g{start}{ref}>{tumor}`}
          />
        ),
        cell: ({ row }) => (
          <SMTableDNAChange
            DNAChange={row.original.dna_change}
            mutationID={row.original.mutation_id}
            isModal={false}
            geneSymbol={null as unknown as string}
            setEntityMetadata={setEntityMetadata as unknown as Dispatch<SetStateAction<entityMetadataType>>}
          />
        ),
      }),

      SMTableColumnHelper.display({
        id: 'protein_change',
        header: 'Protein Change',
        cell: ({ row }) => (
          <SMTableProteinChange
            proteinChange={row.original.protein_change}
            shouldOpenModal={isModal && geneSymbol === undefined}
            shouldLink={projectId !== undefined}
            setEntityMetadata={setEntityMetadata as unknown as Dispatch<SetStateAction<entityMetadataType>>}
            ariaId={`${componentId}-mutation-table-${row.original.mutation_id}`}
          />
        ),
      }),

      SMTableColumnHelper.accessor('type', {
        id: 'type',
        header: 'Type',
      }),
      SMTableColumnHelper.display({
        id: 'consequences',
        header: () => (
          <HeaderTooltip
            title="Consequences"
            tooltip="Consequences for canonical transcript"
          />
        ),
        cell: ({ row }) => (
          <SMTableConsequences consequences={row.original.consequences} />
        ),
      }),
      SMTableColumnHelper.display({
        id: `#_affected_cases_in_${
          geneSymbol ? geneSymbol : projectId ? projectId : 'Cohort'
        }`,
        header: () => (
          <HeaderTooltip
            title={`# Affected Cases
          in ${geneSymbol ? geneSymbol : projectId ? projectId : 'Cohort'}`}
            tooltip={`# Cases where Mutation is observed in ${
              geneSymbol ?? projectId ?? 'Cohort'
            }
              / ${
                geneSymbol
                  ? `# Cases with variants in ${geneSymbol}`
                  : `Cases tested for Simple Somatic Mutations in ${
                      projectId ?? 'Cohort'
                    }`
              }
            `}
          />
        ),
        cell: ({ row }) => (
          <NumeratorDenominator
            numerator={row.original['#_affected_cases_in_cohort'].numerator}
            denominator={row.original['#_affected_cases_in_cohort'].denominator}
            boldNumerator={true}
          />
        ),
      }),

      SMTableColumnHelper.display({
        id: '#_affected_cases_across_the_gdc',
        header: () => (
          <HeaderTooltip
            title={`# Affected Cases
          Across the GDC`}
            tooltip={`# Cases where Mutation is observed /
           # Cases tested for Simple Somatic Mutations portal wide
           Expand to see breakdown by project`}
          />
        ),
        cell: ({ row }) => {
          const { numerator, denominator } = row.original[
            '#_affected_cases_across_the_gdc'
          ] ?? { numerator: 0, denominator: 1 };
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
                    <CollapseCircleIcon size="1.25em" className="text-accent" />
                  )}
                </div>
              )}
              {row.getCanExpand() && (
                <RatioWithSpring index={0} item={{ numerator, denominator }} />
              )}
            </div>
          );
        },
      }),
      SMTableColumnHelper.display({
        id: 'impact',
        header: () => <ImpactHeaderWithTooltip />,
        cell: ({ row }) => <SMTableImpacts impact={row.original.impact} />,
      }),
    ],
    [
      geneSymbol,
      handleSsmToggled,
      handleSurvivalPlotToggled,
      isDemoMode,
      isModal,
      projectId,
      setEntityMetadata,
      generateFilters,
      toggledSsms,
      componentId,
      currentPage,
      totalPages,
      cohortFilters,
    ],
  );

  return SMTableDefaultColumns;
};

export const getMutation = (
  sm: any,
  selectedSurvivalPlot: ComparativeSurvival | undefined,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
): SomaticMutation => {
  const {
    ssm_id,
    genomic_dna_change,
    mutation_subtype,
    consequence,
    filteredOccurrences,
    occurrence,
  } = sm;

  const [
    {
      transcript: {
        consequence_type = undefined,
        gene: { gene_id = undefined, symbol = undefined } = {},
        aa_change = undefined,
        annotation: {
          polyphen_impact = undefined,
          polyphen_score = undefined,
          sift_impact = undefined,
          sift_score = undefined,
          vep_impact = undefined,
        } = {},
      } = {},
    } = {},
  ] = consequence;

  return {
    select: ssm_id,
    mutation_id: ssm_id,
    dna_change: genomic_dna_change,
    type: filterMutationType(mutation_subtype),
    consequences: consequence_type,
    protein_change: {
      symbol: symbol,
      geneId: gene_id,
      aaChange: aa_change,
    },
    '#_affected_cases_in_cohort': {
      numerator: filteredOccurrences,
      denominator: filteredCases,
    },
    '#_affected_cases_across_the_gdc': {
      numerator: occurrence,
      denominator: cases,
    },
    cohort: {
      checked: true,
    },
    survival: {
      label: `${symbol} ${aa_change ? aa_change : ''} ${humanify({
        term: consequence_type?.replace('_variant', '').replace('_', ' '),
      })}`,
      name: genomic_dna_change,
      symbol: ssm_id,
      checked: ssm_id == selectedSurvivalPlot?.symbol,
    },
    impact: {
      polyphenImpact: polyphen_impact,
      polyphenScore: polyphen_score,
      siftImpact: sift_impact,
      siftScore: sift_score,
      vepImpact: vep_impact,
    },
    ssmsTotal,
  };
};

export const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];

export const truncateAfterMarker = (
  term: string,
  markers: string[] = DNA_CHANGE_MARKERS,
  omission = '…',
): string => {
  const markersByIndex = markers.reduce(
    (acc, marker) => {
      const index = term.indexOf(marker);
      if (index !== -1) {
        return { index, marker };
      }
      return acc;
    },
    { index: -1, marker: '' },
  );
  const { index, marker } = markersByIndex;
  if (index !== -1 && term.length > index + marker.length + 8) {
    return `${term.substring(0, index + marker.length + 8)}${omission}`;
  }
  return term;
};

export const handleTSVDownload = () => {
  alert('handleTSVDownload');
};
