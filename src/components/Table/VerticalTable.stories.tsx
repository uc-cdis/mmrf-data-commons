import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import VerticalTable from './VerticalTable';

const meta = {
  component: VerticalTable,
  title: 'components/VerticalTable',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof VerticalTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: [
      {
        id: 'gene',
        header: 'Gene',
        accessorKey: 'gene',
      },
      {
        id: 'aa_change',
        header: 'AA Change',
        accessorKey: 'aa_change',
      },
      {
        id: 'consequences',
        accessorKey: 'consequences',
      },
      {
        id: 'coding_dna_change',
        header: 'Coding DNA Change',
        accessorKey: 'coding_dna_change',
      },
      {
        id: 'impact',
        header: 'impact',
      },
      {
        id: 'gene_strand',
        header: 'Gene Strand',
      },
      {
        id: 'transcript',
        header: 'Transcript',
      },
    ],
    data: [
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R282W',
        coding_dna_change: 'c.844C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000269305',
        is_canonical: true,
        gene_strand: 'a',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R123W',
        coding_dna_change: 'c.367C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000619186',
        is_canonical: false,
        gene_strand: 'b',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R123W',
        coding_dna_change: 'c.367C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000618944',
        is_canonical: false,
        gene_strand: 'c',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.999,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R123W',
        coding_dna_change: 'c.367C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000610623',
        is_canonical: false,
        gene_strand: 'd',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.998,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R150W',
        coding_dna_change: 'c.448C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000504290',
        is_canonical: false,
        gene_strand: 'e',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.998,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R150W',
        coding_dna_change: 'c.448C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000509690',
        is_canonical: false,
        gene_strand: 'f',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R150W',
        coding_dna_change: 'c.448C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000504937',
        is_canonical: false,
        gene_strand: 'g',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R150W',
        coding_dna_change: 'c.448C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000510385',
        is_canonical: false,
        gene_strand: -1,
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.999,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R243W',
        coding_dna_change: 'c.727C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000619485',
        is_canonical: false,
        gene_strand: 'h',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
      {
        gene: 'TP53',
        gene_id: 'ENSG00000141510',
        aa_change: 'R243W',
        coding_dna_change: 'c.727C>T',
        consequences: 'missense_variant',
        transcript: 'ENST00000635293',
        is_canonical: false,
        gene_strand: 'i',
        impact: {
          polyphen_impact: 'probably_damaging',
          polyphen_score: 1,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
      },
    ],
    customDataTestID: 'customDataTestID',
    tableTotalDetail: 'Table Total Detail',
    additionalControls: 'Additional Controls',
    footer: (
      <tr>
        <td>Footer</td>
      </tr>
    ),
    getRowCanExpand: () => false,
    expandableColumnIds: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['customDataTestID'];
    await new Promise(resolve => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
