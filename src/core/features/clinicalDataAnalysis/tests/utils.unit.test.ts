// write unit test for buildNestedCountsQuery

import { buildNestedCountsQuery } from '../utils';
import { Accessibility, FilterSet } from '@gen3/core';

describe('buildNestedCountsQuery', () => {
  const defaultParams = {
    type: 'case',
    field: 'data_type',
    filters: {
      mode: 'and',
      root: {
        ['data_type']: {
          operator: 'in',
          field: 'data_type',
          operands: ['test'],
        },
      },
    } as FilterSet,
    rangeName: 'range_0',
    accessibility: Accessibility.ALL,
  };

  it('should build a query with all parameters', () => {
    const result = buildNestedCountsQuery(defaultParams);
    expect(result).toContain('query rangeQuery_range_0 ($accessibility: Accessibility,$filter: JSON) { _aggregation { range_0 : case (accessibility: $accessibility filter: $filter) { data_type { _totalCount } } } }');
  });
});
