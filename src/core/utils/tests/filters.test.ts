// filters.test.ts
import { FilterSet } from '@gen3/core';
import { mergeFilterWithPrefix } from '../filters';


describe('mergeFilterWithPrefix', () => {
  it('should return the source filter unchanged when the other filter has no root', () => {
    const source: FilterSet = { root: { key1: { field: 'key1', operator: 'in', operands: ['value1'] } }, mode: 'and' };
    const other: FilterSet = { root: {}, mode: 'and' };

    const result = mergeFilterWithPrefix(source, other, 'prefix_');

    expect(result).toEqual(source);
  });

  it('should add prefixed keys from the other filter to the source filter', () => {
    const source: FilterSet = { root: {}, mode: 'and' };
    const other: FilterSet = {
      root: {
        key1: { field: 'key1', operator: 'in', operands: ['value1'] },
      },
      mode: 'and',
    };

    const expected: FilterSet = {
      root: {
        'prefix_key1': { field: 'prefix_key1', operator: 'in', operands: ['value1'] },
      },
      mode: 'and',
    };

    const result = mergeFilterWithPrefix(source, other, 'prefix_');

    expect(result).toEqual(expected);
  });

  it('should overwrite existing filters in the source filter if a prefixed key already exists', () => {
    console.warn = jest.fn();

    const source: FilterSet = {
      root: { 'prefix_key1': { field: 'prefix_key1', operator: 'in', operands: ['oldValue'] } },
      mode: 'and',
    };
    const other: FilterSet = {
      root: { key1: { field: 'key1', operator: 'in', operands: ['newValue'] } },
      mode: 'and',
    };

    const expected: FilterSet = {
      root: {
        'prefix_key1': { field: 'prefix_key1', operator: 'in', operands: ['newValue'] },
      },
      mode: 'and',
    };

    const result = mergeFilterWithPrefix(source, other, 'prefix_');

    expect(result).toEqual(expected);
    expect(console.warn).toHaveBeenCalledWith('Overwriting existing filter for key: prefix_key1');
  });

  it('should skip non-Includes filters in the other filter and log a warning', () => {
    console.warn = jest.fn();

    const source: FilterSet = { root: {}, mode: 'and' };
    const other: FilterSet = { root: { key1: {
            operator: '=', operand: 12, field: 'key1',
        } }, mode: 'and' };

    const result = mergeFilterWithPrefix(source, other, 'prefix_');

    expect(result).toEqual(source);
    expect(console.warn).toHaveBeenCalledWith('Skipping non-Includes filter for key: key1', {field: "key1", operand: 12, operator: "="});
  });

  it('should handle an empty source and other filter', () => {
    const source: FilterSet = { root: {}, mode: 'and' };
    const other: FilterSet = { root: {}, mode: 'and' };

    const result = mergeFilterWithPrefix(source, other, 'prefix_');

    expect(result).toEqual(source);
  });
});
