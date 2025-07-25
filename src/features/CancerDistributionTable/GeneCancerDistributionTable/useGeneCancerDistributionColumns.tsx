import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useDeepCompareMemo } from 'use-deep-compare';
import Link from 'next/link';
import ExpandRowComponent from '@/components/Table/ExpandRowComponent';
import { HeaderTooltip } from '@/components/Table/HeaderTooltip';
import NumeratorDenominator from '@/components/NumeratorDenominator';
import { FilterSet } from '@/core';
import { CancerDistributionGeneType } from '../types';

const createSortingFn =
  (key: keyof CancerDistributionGeneType) =>
  (rowA: CancerDistributionGeneType, rowB: CancerDistributionGeneType) => {
    if (rowA[key] > rowB[key]) return 1;
    if (rowA[key] < rowB[key]) return -1;
    return 0;
  };

const cancerDistributionTableColumnHelper =
  createColumnHelper<CancerDistributionGeneType>();

export const useGeneCancerDistributionColumns = ({
  symbol,
  expandedColumnId,
  gene_id,
  cohortFilters,
  genomicFilters,
}: {
  isGene: boolean;
  symbol: string;
  expandedColumnId?: string;
  gene_id: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}) => {
  return useDeepCompareMemo(
    () => [
      cancerDistributionTableColumnHelper.accessor('project', {
        id: 'project' as const,
        header: 'Project',
        cell: ({ getValue }) => (
          <Link
            href={`/projects/${getValue()}`}
            className="text-utility-link underline"
          >
            {getValue()}
          </Link>
        ),
        enableSorting: false,
      }),
      cancerDistributionTableColumnHelper.accessor('disease_type', {
        id: 'disease_type' as const,
        header: 'Disease Type',
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Disease Types"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === 'disease_type'}
          />
        ),
      }),
      cancerDistributionTableColumnHelper.accessor('primary_site', {
        id: 'primary_site' as const,
        header: 'Primary Site',
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Primary Sites"
            isRowExpanded={row.getIsExpanded()}
            isColumnExpanded={expandedColumnId === 'primary_site'}
          />
        ),
      }),
      cancerDistributionTableColumnHelper.accessor(
        'ssm_affected_cases_percent',
        {
          id: '#_ssm_affected_cases' as const,
          header: () => (
            <HeaderTooltip
              title="# SSM Affected Cases"
              tooltip={`# Cases tested for Simple Somatic Mutations in the Project affected by ${symbol}
        / # Cases tested for Simple Somatic Mutations in the Project`}
            />
          ),
          cell: ({ row }) => (
            <NumeratorDenominator
              numerator={row.original.ssm_affected_cases.numerator || 0}
              denominator={row.original.ssm_affected_cases.denominator || 0}
              boldNumerator
            />
          ),
          meta: {
            sortingFn: createSortingFn('ssm_affected_cases_percent'),
          },
          enableSorting: true,
        },
      ),

      cancerDistributionTableColumnHelper.accessor(
        'cnv_amplifications_percent',
        {
          id: '#_cnv_amplifications' as const,
          header: () => (
            <HeaderTooltip
              title="# CNV Amplifications"
              tooltip={`# Cases in the Project affected by CNV amplifications in ${symbol} / # Cases tested for Copy Number Variations in the Project`}
            />
          ),
          cell: ({ row }) => (
            <NumeratorDenominator
              numerator={row.original.cnv_amplifications.numerator || 0}
              denominator={row.original.cnv_amplifications.denominator || 0}
              boldNumerator
            />
          ),
          meta: {
            sortingFn: createSortingFn('cnv_amplifications_percent'),
          },
          enableSorting: true,
        },
      ),
      cancerDistributionTableColumnHelper.accessor('cnv_gains_percent', {
        id: '#_cnv_gains' as const,
        header: () => (
          <HeaderTooltip
            title="# CNV Gains"
            tooltip={`# Cases in the Project affected by CNV gains in ${symbol} / # Cases tested for Copy Number Variations in the Project
              `}
          />
        ),
        cell: ({ row }) => (
          <NumeratorDenominator
            numerator={row.original.cnv_gains.numerator || 0}
            denominator={row.original.cnv_gains.denominator || 0}
            boldNumerator
          />
        ),
        meta: {
          sortingFn: createSortingFn('cnv_gains_percent'),
        },
        enableSorting: true,
      }),
      cancerDistributionTableColumnHelper.accessor(
        'cnv_heterozygous_deletions_percent',
        {
          id: '#_cnv_heterozygous_deletions' as const,
          header: () => (
            <HeaderTooltip
              title="# CNV Heterozygous Deletions"
              tooltip={` Cases in the Project affected by CNV heterozygous deletions in ${symbol} / # Cases tested for Copy Number Variations in the Project
              `}
            />
          ),
          cell: ({ row }) => (
            <NumeratorDenominator
              numerator={row.original.cnv_heterozygous_deletions.numerator || 0}
              denominator={
                row.original.cnv_heterozygous_deletions.denominator || 0
              }
              boldNumerator
            />
          ),
          meta: {
            sortingFn: createSortingFn('cnv_heterozygous_deletions_percent'),
          },
          enableSorting: true,
        },
      ),
      cancerDistributionTableColumnHelper.accessor(
        'cnv_homozygous_deletions_percent',
        {
          id: '#_cnv_homozygous_deletions' as const,
          header: () => (
            <HeaderTooltip
              title="# CNV Homozygous Deletions"
              tooltip={` Cases in the Project affected by CNV homozygous deletions in ${symbol} / # Cases tested for Copy Number Variations in the Project
              `}
            />
          ),
          cell: ({ row }) => (
            <NumeratorDenominator
              numerator={row.original.cnv_homozygous_deletions.numerator || 0}
              denominator={
                row.original.cnv_homozygous_deletions.denominator || 0
              }
              boldNumerator
            />
          ),
          meta: {
            sortingFn: createSortingFn('cnv_homozygous_deletions_percent'),
          },
          enableSorting: true,
        },
      ),
      cancerDistributionTableColumnHelper.accessor('num_mutations', {
        id: '#_mutations' as const,
        header: () => (
          <HeaderTooltip
            title="# Mutations"
            tooltip={`# Unique Simple Somatic Mutations observed in ${symbol} in the Project`}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => row.original.num_mutations.toLocaleString(),
        meta: {
          sortingFn: createSortingFn('num_mutations'),
        },
      }),
    ],
    [symbol, expandedColumnId, gene_id, cohortFilters, genomicFilters],
  );
};
