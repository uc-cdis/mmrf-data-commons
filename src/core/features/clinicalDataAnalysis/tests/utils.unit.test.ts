// write unit test for buildNestedCountsQuery

import { buildAliasedNestedCountsQuery, buildRangeFilters, buildRangeQuery } from '../utils';
import { Accessibility, FilterSet } from '@gen3/core';

const createParams = (field: string, rangeName: string = "range_0") => {
  return {
    type: 'case',
    field,
    filters: {
      mode: 'and',
      root: {
        [field]: {
          operator: 'in',
          field,
          operands: ['test'],
        },
      },
    } as FilterSet,
    rangeName,
    accessibility: Accessibility.ALL,
  };
};

describe('build range queryies', () => {

  it('should build a query with all parameters', () => {
    const params = createParams('data_type');
    const result = buildAliasedNestedCountsQuery(params);
    expect(result).toContain('query rangeQuery_range_0 ($accessibility: Accessibility,$filter: JSON) { _aggregation { range_0 : case (accessibility: $accessibility filter: $range_0) { data_type { _totalCount } } } }');
  });

  it('should build a query with nested values with all parameters', () => {
    const params = createParams('demographic.race');

    const result = buildAliasedNestedCountsQuery(params);
    expect(result).toContain('query rangeQuery_range_0 ($accessibility: Accessibility,$filter: JSON) { _aggregation { range_0 : case (accessibility: $accessibility filter: $range_0) { demographic { race { _totalCount } } } } }');
  });
});

describe('build range filters', () => {
  it('shoulda set of query filters for ranges', () => {
    const ranges = [
      {
        "from": 0,
        "to": 6574
      },
      {
        "from": 6574,
        "to": 13148
      },
      {
        "from": 13148,
        "to": 19723
      },
      {
        "from": 19723,
        "to": 26297
      },
      {
        "from": 26297,
        "to": 32873
      }
    ];

    const result = buildRangeFilters('data_type', 'range', ranges);

    expect(result).toEqual({"range_0": {"operands": [{"field": "data_type", "operand": 0, "operator": ">="}, {"field": "data_type", "operand": 6574, "operator": "<"}], "operator": "and"}, "range_1": {"operands": [{"field": "data_type", "operand": 6574, "operator": ">="}, {"field": "data_type", "operand": 13148, "operator": "<"}], "operator": "and"}, "range_2": {"operands": [{"field": "data_type", "operand": 13148, "operator": ">="}, {"field": "data_type", "operand": 19723, "operator": "<"}], "operator": "and"}, "range_3": {"operands": [{"field": "data_type", "operand": 19723, "operator": ">="}, {"field": "data_type", "operand": 26297, "operator": "<"}], "operator": "and"}, "range_4": {"operands": [{"field": "data_type", "operand": 26297, "operator": ">="}, {"field": "data_type", "operand": 32873, "operator": "<"}], "operator": "and"}}
    );
  });
})

describe('build range queryies', () => {
  it('should build a query with all parameters', () => {

    const ranges = [
      {
        "from": 0,
        "to": 6574
      },
      {
        "from": 6574,
        "to": 13148
      },
      {
        "from": 13148,
        "to": 19723
      },
      {
        "from": 19723,
        "to": 26297
      },
      {
        "from": 26297,
        "to": 32873
      }
    ];
    const results = buildRangeQuery('demographic.race', "range", ranges)

    console.log(results)

    expect(results.query).toContain('query rangeQuery_range_0 ($accessibility: Accessibility,$filter: JSON) { _aggregation { range_0 : case (accessibility: $accessibility filter: $range_0) { demographic { race { _totalCount } } } } }');
    expect(results.variables).toEqual({
      "range_0": {
        "operands": [
          {
            "field": "demographic.race",
            "operand": 0,
            "operator": ">="
          },
          {
            "field": "demographic.race",
            "operand": 6574,
            "operator": "<"
          }
        ],
        "operator": "and"
      },
      "range_1": {
        "operands": [
          {
            "field": "demographic.race",
            "operand": 6574,
            "operator": ">="
          },
          {
            "field": "demographic.race",
            "operand": 13148,
            "operator": "<"
          }
        ],
        "operator": "and"
      },
      "range_2": {
        "operands": [
          {
            "field": "demographic.race",
            "operand": 13148,
            "operator": ">="
          },
          {
            "field": "demographic.race",
            "operand": 19723,
            "operator": "<"
          }
        ],
        "operator": "and"
      },
      "range_3": {
        "operands": [
          {
            "field": "demographic.race",
            "operand": 19723,
            "operator": ">="
          },
          {
            "field": "demographic.race",
            "operand": 26297,
            "operator": "<"
          }
        ],
        "operator": "and"
      },
      "range_4": {
        "operands": [
          {
            "field": "demographic.race",
            "operand": 26297,
            "operator": ">="
          },
          {
            "field": "demographic.race",
            "operand": 32873,
            "operator": "<"
          }
        ],
        "operator": "and"
      }
    })
  });
})
