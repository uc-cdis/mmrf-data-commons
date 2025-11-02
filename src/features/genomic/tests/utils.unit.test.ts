// utils.test.ts
import { ActiveGeneAndSSMFilters } from '../types';

import { mergeGeneAndSSMFilters } from '@/core/genomic/genomicFilters';

describe('mergeGeneAndSSMFilters', () => {
  it('should merge SSM filters into gene filters', () => {
    const filters: ActiveGeneAndSSMFilters = {
      gene: { mode: "and", root: {} },
      ssm: {
        mode: "and", root: {
          sampleType: { field: 'sampleType', operator: 'in', operands: ['primary', 'metastasis'] },
        },
      },
    };

    const result = mergeGeneAndSSMFilters(filters);
    expect(result.gene.root['case.ssm.sampleType']).toEqual({
      field: 'case.ssm.sampleType',
      operator: 'in',
      operands: ['primary', 'metastasis'],
    });
  });

  it('should merge gene filters into SSM filters', () => {
    const filters: ActiveGeneAndSSMFilters = {
      gene: {
        mode: "and", root: {
          geneName: { field: 'geneName', operator: 'in', operands: ['TP53', 'BRCA1'] },
        },
      },
      ssm: { mode: "and", root: {} },
    };

    const result = mergeGeneAndSSMFilters(filters);
    expect(result.ssm.root['consequence.transcript.gene.geneName']).toEqual({
      field: 'consequence.transcript.gene.geneName',
      operator: 'in',
      operands: ['TP53', 'BRCA1'],
    });
  });

  it('should handle cases where both gene and SSM filters are empty', () => {
    const filters: ActiveGeneAndSSMFilters = {
      gene: { mode: "and", root: {} },
      ssm: { mode: "and", root: {} },
    };

    const result = mergeGeneAndSSMFilters(filters);
    expect(result).toEqual(filters);
  });

  it('should merge both gene and SSM filters correctly', () => {
    const filters: ActiveGeneAndSSMFilters = {
      gene: {
        mode: "and", root: { geneName: { field: 'geneName', operator: 'in', operands: ['TP53', 'BRCA1'] } },
      },
      ssm: {
        mode: "and", root: {
          sampleType: { field: 'sampleType', operator: 'in', operands: ['primary', 'metastasis'] },
        },
      },
    };

    const result = mergeGeneAndSSMFilters(filters);

    expect(result.gene.root['case.ssm.sampleType']).toEqual({
      field: 'case.ssm.sampleType',
      operator: 'in',
      operands: ['primary', 'metastasis'],
    });
    expect(result.ssm.root['consequence.transcript.gene.geneName']).toEqual({
      field: 'consequence.transcript.gene.geneName',
      operator: 'in',
      operands: ['TP53', 'BRCA1'],
    });
  });
});
