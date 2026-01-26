import { rawDataQueryStrForEachField } from '@gen3/core';

type Sort = ReadonlyArray<Record<string, string>>;

const toGraphQLInputValue = (value: unknown): string => {
  if (value === null) return 'null';

  if (Array.isArray(value)) {
    return `[${value.map(toGraphQLInputValue).join(',')}]`;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.entries(obj)
      .map(([k, v]) => `${k}: ${toGraphQLInputValue(v)}`)
      .join(',')}}`;
  }

  if (typeof value === 'string') {
    // treat sort directions as enum values (no quotes) if that’s what your GraphQL expects
    if (value === 'asc' || value === 'desc') return value;

    // otherwise quote as a GraphQL string
    return JSON.stringify(value);
  }

  // numbers / booleans
  return String(value);
};



export const buildRawQuery = (
  type: string,
  indexPrefix: string,
  fields: string[],
  offset: number = 0,
  size: number = 10,
  sort?: ReadonlyArray<Record<string, 'asc' | 'desc'>>,
  accessibility = 'all',
  filterName = 'filter',
  format?: string,
) => {
  const params = [
    ...[`$${filterName}: JSON`],
    ...(sort ? ['$sort: JSON'] : []),
    ...(format ? ['$format: Format'] : []),
  ].join(',');
  const queryLine = `query getRawDataAndTotalCounts (${params}) {`;
  const sortGql = sort ? toGraphQLInputValue(sort as Sort) : '';

  const dataParams = [
    ...[`filter: $${filterName}`],
    ...(format ? [`format: ${format}`] : []),
    ...(sort ? `sort: ${sortGql}` : []),
  ].join(',');
  const dataTypeLine = `${indexPrefix}${type} (accessibility: ${accessibility}, offset: ${offset}, first: ${size},
        ${dataParams}) {`;

  const typeAggsLine = `${type} (${`filter: $${filterName},`} accessibility: ${accessibility}) {`;

  const processedFields = fields.map((field) =>
    rawDataQueryStrForEachField(field),
  );

  const query = `${queryLine}
    ${dataTypeLine}
      ${processedFields.join(' ')}
            }
            ${indexPrefix}_aggregation {
              ${typeAggsLine}
                _totalCount
              }
            }
        }`;
  return query;
};


export const processRawQuery = (response: Record<string, any>, containsDots: Array<string>,
                                type: string, indexPrefix? : string) => {
  // check if dot seperated in an array and not an object
  if (containsDots && containsDots.length > 0 && response.data) {
    const containsDotsUniqueBase = containsDots.reduce((acc, field) => {
      const partsArr = field.split('.');
      if (partsArr.length < 2) {
        throw new Error(
          "Explorer does not support field with more than one '.' separator",
        );
      }
      const basePart = partsArr[0];
      if (!acc.includes(basePart)) {
        acc.push(basePart);
      }
      return acc;
    }, [] as string[]);

    // checks if api is returning an array of objects for the base part
    // if so, it restructures the object to group the sub parts into arrays
    // e.g. {a: [{b: 1, c:2}, {b:3, c:4}]} becomes {a: {b: [1,3], c:[2,4]}}
    // this is to make it easier to work with in the table component
    // currently only supports one level of nesting
    // also puts original into subRows for dropdown viewing
    const tempResponse = response.data[
      `${indexPrefix ?? ''}${type}`
      ].map((item: Record<string, any>) => {
      const tempItem = item;
      for (let i = 0; i < containsDotsUniqueBase.length; i++) {
        const basePart = containsDotsUniqueBase[i];
        if (item[basePart] && Array.isArray(item[basePart])) {
          // move original to subRows
          tempItem.subRows = tempItem[basePart];

          tempItem[basePart] = tempItem[basePart].reduce(
            (acc: Record<string, any>, obj: Record<string, any>) => {
              for (const key in obj) {
                if (Object.hasOwn(obj, key)) {
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(obj[key]);
                }
              }
              return acc;
            },
            {},
          );
        }
      }
      return tempItem;
    });

    return {
      data: {
        _aggregation: response.data._aggregation,
        [`${indexPrefix ?? ''}${type}`]: tempResponse,
      },
    };
  }

};
