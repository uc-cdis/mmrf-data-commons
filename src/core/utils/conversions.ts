import { HistogramData } from "@gen3/core"
import { HistogramDataAsStringKey } from '@/core';

export const DAYS_IN_YEAR = 365.25;

/**
 * Converts HistogramData to HistogramDataAsStringKey by ensuring the key is a string.
 * If the key is already a string, it's used as is.
 * If the key is a number tuple [min, max], it's converted to a string in the format "min-max".
 *
 * @param data The HistogramData object to convert
 * @returns HistogramDataAsStringKey with the converted key
 */
export const convertToHistogramDataAsStringKey = (
  data: HistogramData,
): HistogramDataAsStringKey => {
  return {
    key:
      typeof data.key === 'string' ? data.key : `${data.key[0]}-${data.key[1]}`,
    count: data.count,
  };
};

export const calculatePercentageAsNumber = (
  count: number,
  total: number,
): number => (count ? (count / total) * 100 : 0);

export const calculatePercentageAsString = (
  count: number,
  total: number,
): string => `${((count / total) * 100).toFixed(2)}%`;

export const capitalize = (original: string): string => {
  const customCapitalizations: Record<string, string> = {
    id: 'ID',
    uuid: 'UUID',
    dna: 'DNA',
    dbsnp: 'dbSNP',
    cosmic: 'COSMIC',
    civic: 'CIViC',
    dbgap: 'dbGaP',
    ecog: 'ECOG',
    bmi: 'BMI',
    gdc: 'GDC',
    cnv: 'CNV',
    ssm: 'SSM',
    aa: 'AA',
  };

  return original
    .split(' ')
    .map(
      (word) =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join(' ');
};

interface HumanifyParams {
  term: string;
  capitalize?: boolean;
  facetTerm?: boolean;
}
export const humanify = ({
                           term = '',
                           capitalize: cap = true,
                           facetTerm = false,
                         }: HumanifyParams): string => {
  let original;
  let humanified;
  if (facetTerm) {
    // Splits on capital letters followed by lowercase letters to find
    // words squished together in a string.
    original = term?.split(/(?=[A-Z][a-z])/).join(' ');
    humanified = term?.replace(/\./g, ' ').replace(/_/g, ' ').trim();
  } else {
    const split = (original || term)?.split('.');
    humanified = split[split.length - 1]?.replace(/_/g, ' ').trim();

    // Special case 'name' to include any parent nested for sake of
    // specificity in the UI
    if (humanified === 'name' && split?.length > 1) {
      humanified = `${split[split?.length - 2]} ${humanified}`;
    }
  }
  return cap ? capitalize(humanified) : humanified;
};

/*https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/utils/ageDisplay.js*/
/**
 * Converts age in days into a human-readable format.
 *
 * @param ageInDays - The age in days.
 * @param yearsOnly - If true, only display years.
 *   @defaultValue false
 * @param defaultValue - The default value to return if ageInDays is falsy.
 *   @defaultValue "--"
 * @returns The formatted age string.
 */
export const ageDisplay = (
  ageInDays: number,
  yearsOnly: boolean = false,
  defaultValue: string = '--',
): string => {
  if (ageInDays !== 0 && !ageInDays) {
    return defaultValue;
  }
  const calculateYearsAndDays = (
    years: number,
    days: number,
  ): [number, number] => (days === 365 ? [years + 1, 0] : [years, days]);

  const ABS_AGE_DAYS = Math.abs(ageInDays);

  const [years, remainingDays] = calculateYearsAndDays(
    Math.floor(ABS_AGE_DAYS / DAYS_IN_YEAR),
    Math.ceil(ABS_AGE_DAYS % DAYS_IN_YEAR),
  );

  const formattedYears =
    years === 0 ? '' : `${years} ${years === 1 ? 'year' : 'years'}`;

  const formattedDays =
    !yearsOnly && remainingDays > 0
      ? `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
      : years === 0 && remainingDays === 0
        ? '0 days'
        : '';

  const ageString = [formattedYears, formattedDays].filter(Boolean).join(' ');

  return ageInDays >= 0 ? ageString : `-${ageString}`;
};

export function dotNotationToGraphql(dotString: string | string[]): string {
  /**
   * Convert dot notation string(s) into a GraphQL nested query structure.
   * When given an array, merges fields with common ancestors.
   *
   * @param dotString - A dot-separated string or array of strings
   * @returns A GraphQL nested query string with merged common ancestors
   *
   * @example
   * dotNotationToGraphql("user.profile.name")
   * // Returns: "user { profile { name } }"
   *
   * @example
   * dotNotationToGraphql(["user.profile.name", "user.profile.email", "user.id"])
   * // Returns: "user { profile { name email } id }"
   *
   * @example
   * dotNotationToGraphql(["cases.samples.aliquots.submitter_id", "cases.samples.sample_type"])
   * // Returns: "cases { samples { aliquots { submitter_id } sample_type } }"
   */

  // Handle empty input
  if (!dotString) {
    return "";
  }

  // Convert single string to array for uniform processing
  const inputs = Array.isArray(dotString) ? dotString : [dotString];

  // Filter out invalid entries
  const validInputs = inputs.filter(s => s && typeof s === 'string');

  if (validInputs.length === 0) {
    return "";
  }

  // If only one valid input, use simple logic
  if (validInputs.length === 1) {
    const parts = validInputs[0].split(".");
    if (parts.length === 1) {
      return parts[0];
    }
    let result = parts[parts.length - 1];
    for (let i = parts.length - 2; i >= 0; i--) {
      result = `${parts[i]} { ${result} }`;
    }
    return result;
  }

  // Build a tree structure to merge common ancestors
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};

  // Insert each dot notation path into the tree
  for (const input of validInputs) {
    const parts = input.split(".");
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        // Leaf node
        current[part] = current[part] || null;
      } else {
        // Branch node
        if (!current[part] || current[part] === null) {
          current[part] = {};
        }
        current = current[part] as TreeNode;
      }
    }
  }

  // Convert tree to GraphQL string
  function treeToGraphql(node: TreeNode): string {
    const fields: string[] = [];

    for (const key of Object.keys(node).sort()) {
      const value = node[key];

      if (value === null) {
        // Leaf node
        fields.push(key);
      } else {
        // Branch node with children
        const nested = treeToGraphql(value);
        fields.push(`${key} { ${nested} }`);
      }
    }

    return fields.join(" ");
  }

  return treeToGraphql(tree);
}
