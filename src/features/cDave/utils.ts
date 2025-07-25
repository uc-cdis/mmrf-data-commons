import { omitBy, some, capitalize, isNumber, flatten } from "lodash";
import {
  FilterSet,
  isObject,
  AggregationsData,
} from "@gen3/core";
import { Buckets, Bucket, Stats } from "@/core/features/api/types";
import { NumericFromTo, DAYS_IN_YEAR} from "@gen3/frontend";
import {
  CAPITALIZED_TERMS,
  SPECIAL_CASE_FIELDS,
  DATA_DIMENSIONS,
  MISSING_KEY,
} from "./constants";
import {
  CustomInterval,
  DataDimension,
  DisplayData,
  NamedFromTo,
  SelectedFacet,
  CategoricalBins,
  ContinuousCustomBinnedData, CustomBinData, isCategoricalBins,
} from './types';
import { aggregationFns } from '@tanstack/table-core';

export const filterUsefulFacets = (
  facets: Record<string, Buckets | Stats>,
): Record<string, Buckets | Stats> => {
  return omitBy(facets, (aggregation) =>
    some([
      (aggregation as Buckets).buckets &&
        (aggregation as Buckets).buckets.filter(
          (bucket: Bucket) => bucket.key !== "_missing",
        ).length === 0,
      (aggregation as Stats).stats && (aggregation as Stats).stats.count === 0,
    ]),
  );
};

export const combineAnalysisResults = (aggregations: AggregationsData) => {
  return  Object.entries(aggregations).reduce((acc : Record<string, Buckets>, [field, data]) => {
    const convertedData = data.reduce((results: Array<Bucket>, x ) => {
      if (typeof x.key === 'string')
        results.push({ key: x.key.toString(), count: x.count});
      return results;
    }, [])

      acc[field]  = { buckets: convertedData }

    return acc;

  }, {});
}

export const createBuckets = (
  min: number,
  max: number,
  customInterval?: number,
): NumericFromTo[] => {
  if (min === max) {
    return [{ from: min, to: max + 1 }];
  }

  const numBuckets = customInterval
    ? Math.floor((max - min) / customInterval)
    : 5;
  const interval = customInterval ? customInterval : (max - min) / 5;

  return Array.from({ length: numBuckets }, (_, i) => ({
    from: i * interval + min,
    to:
      i + 1 === numBuckets
        ? customInterval
          ? max
          : max + 1
        : min + (i + 1) * interval,
  }));
};

export const toDisplayName = (field: string): string => {
  const parsed = field.split(".");
  const fieldName = parsed.at(-1);

  if (fieldName) {

    if (fieldName in SPECIAL_CASE_FIELDS) {
      return SPECIAL_CASE_FIELDS[fieldName];
    }

    return fieldName
      .split("_")
      .map((w) =>
        CAPITALIZED_TERMS.includes(w) ? w.toUpperCase() : capitalize(w),
      )
      .join(" ");
  }
  return "Not Set";
};

export const parseFieldName = (
  field: string,
): { field_type: string; field_name: string; full: string } => {
  const parsed = field.split("__");
  const full = field.replaceAll("__", ".");
  if (
    parsed.at(-2) === "treatments" ||
    parsed.at(-2) === "other_clinical_attributes"
  ) {
    return { field_type: parsed.at(-2) ?? "Not Set", field_name: parsed.at(-1) ?? "Not Set", full };
  }
  return { field_type: parsed.at(0) ?? "Not Set", field_name: parsed.at(-1) ?? "Not Set", full };
};

export const parseContinuousBucket = (bucket: string): string[] => {
  return bucket
    .split("-")
    .map((val, idx, src) => (src[idx - 1] === "" ? `-${val}` : val))
    .filter((val) => val !== "");
};

export const flattenBinnedData = (
  binnedData: Record<string, number | Record<string, number>>,
): DisplayData => {
  const flattenedValues: Record<string, number> = {};

  Object.entries(binnedData).forEach(([k, v]) => {
    if (Number.isInteger(v)) {
      flattenedValues[k] = v as number;
    } else {
      flattenedValues[k] = Object.values(v).reduce((a, b) => a + b);
    }
  });

  return Object.entries(flattenedValues).map(([k, v]) => ({
    key: k,
    displayName: k,
    count: v,
  }));
};

export const formatPercent = (count: number, yTotal: number): string =>
  yTotal === 0
    ? "0.00%"
    : (count / yTotal).toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2,
      });

export const isInterval = (
  customBinnedData: unknown,
): customBinnedData is CustomInterval => {
  if (!Array.isArray(customBinnedData) && isObject(customBinnedData) && customBinnedData?.interval) {
    return true;
  }

  return false;
};

export const useDataDimension = (field: string): boolean => {
  return DATA_DIMENSIONS?.[field]?.toggleValue !== undefined;
};

export const formatValue = (value: number): number => Number(value?.toFixed(2));

export const roundContinuousValue = (
  value: number,
  field: string,
  hasCustomBins: boolean,
): number => {
  if (hasCustomBins) {
    return formatValue(value);
  } else {
    const unit = DATA_DIMENSIONS?.[field]?.unit;
    if (unit === "Days" || unit === "Years") {
      return Math.round(value);
    } else {
      if (value < 1 && value > -1) {
        return formatValue(value);
      } else {
        return Math.round(value);
      }
    }
  }
};

export const convertDataDimension = (
  value: number,
  currentDataDimension?: DataDimension,
  newDataDimension?: DataDimension,
): number => {

  if (!currentDataDimension || !newDataDimension) {
    return value;
  }

  if (currentDataDimension === "Days" && newDataDimension === "Years") {
    return value / DAYS_IN_YEAR;
  } else if (currentDataDimension === "Years" && newDataDimension === "Days") {
    return value * DAYS_IN_YEAR;
  }

  return value;
};

export const createFiltersFromSelectedValues = (
  continuous: boolean,
  field: string,
  selectedFacets: SelectedFacet[],
  customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval | null,
): FilterSet => {
  if (continuous) {
    return {
      mode: "and",
      root: {
        [field]: {
          operator: "or",
          operands: selectedFacets.map((facet) => {
            const customBin =
              customBinnedData &&
              !isInterval(customBinnedData as ContinuousCustomBinnedData)
                ? (customBinnedData as NamedFromTo[]).find(
                    (bin) => bin.name === facet.value,
                  )
                : undefined;
            const [from, to] = customBin
              ? [customBin.from, customBin.to]
              : parseContinuousBucket(facet.value);
            return {
              operator: "and",
              operands: [
                {
                  field,
                  operator: ">=",
                  operand: from,
                },
                {
                  field,
                  operator: "<",
                  operand: to,
                },
              ],
              field,
            };
          }),
        },
      },
    };
  } else {
    const facetValues = customBinnedData
      ? flatten(
          selectedFacets.map((facet) =>
            isCategoricalBins(customBinnedData)
              ? Object.keys(customBinnedData[facet.value as string])
              : facet.value,
          ),
        )
      : selectedFacets.map((facet) => facet.value);
    const hasMissingValue = facetValues.find((v) => v === MISSING_KEY);
    if (hasMissingValue) {
      const restOfFacets = facetValues.filter((v) => v !== MISSING_KEY);
      return {
        mode: "and",
        root: {
          [field]:
            restOfFacets.length > 0
              ? {
                  operator: "or",
                  operands: [
                    {
                      operator: "includes",
                      operands: restOfFacets,
                      field,
                    },
                    {
                      operator: "missing",
                      field,
                    },
                  ],
                }
              : {
                  operator: "missing",
                  field,
                },
        },
      };
    }

    return {
      mode: "and",
      root: {
        [field]: {
          operator: "includes",
          operands: facetValues,
          field,
        },
      },
    };
  }
};

/**
 * Takes a probability (p) and returns the value (quantile) at which the cumulative
 * distribution function reaches or exceeds that probability
 * from https://rangevoting.org/Qnorm.html
 */
export const qnorm = (p: number): number => {
  // ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.

  const split = 0.42;

  const a0 = 2.50662823884;
  const a1 = -18.61500062529;
  const a2 = 41.39119773534;
  const a3 = -25.44106049637;
  const b1 = -8.4735109309;
  const b2 = 23.08336743743;
  const b3 = -21.06224101826;
  const b4 = 3.13082909833;
  const c0 = -2.78718931138;
  const c1 = -2.29796479134;
  const c2 = 4.85014127135;
  const c3 = 2.32121276858;
  const d1 = 3.54388924762;
  const d2 = 1.63706781897;

  const q = p - 0.5;

  let r: number;
  let ppnd: number;

  if (Math.abs(q) <= split) {
    r = q * q;
    ppnd =
      (q * (((a3 * r + a2) * r + a1) * r + a0)) /
      ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
  } else {
    r = p;
    if (q > 0) r = 1 - p;
    if (r > 0) {
      r = Math.sqrt(-Math.log(r));
      ppnd = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
      if (q < 0) ppnd = -ppnd;
    } else {
      ppnd = 0;
    }
  }

  return ppnd;
};

/**
 * Parses response data that either be or simple object or can be nested in arrays up to two levels deep depending on the field
 * @param data - response data from request
 * @returns - flattened list of ids and values
 */
export const parseNestedQQResponseData = (
  data: readonly Record<string, any>[],
  field: string,
): { id: string; value: number }[] => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");
  let parsedValues: any[] = [];

  data.forEach((caseEntry) => {
    if (Array.isArray(caseEntry[clinicalType])) {
      caseEntry[clinicalType].forEach((nestedVal) => {
        if (Array.isArray(nestedVal[clinicalField])) {
          parsedValues = [
            ...parsedValues,
            ...nestedVal[clinicalField].map((valArr) => ({
              id: caseEntry.id,
              value: valArr[clinicalNestedField],
            })),
          ];
        } else {
          parsedValues.push({
            id: caseEntry.id,
            value: nestedVal[clinicalField],
          });
        }
      });
    } else {
      parsedValues.push({
        id: caseEntry.id,
        value: caseEntry[clinicalType][clinicalField],
      });
    }
  });

  return parsedValues
    .filter((c) => isNumber(c.value))
    .sort((a, b) => a.value - b.value);
};
