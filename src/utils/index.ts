import { KeyboardEventHandler } from 'react';
import { CartFile, DataStatus } from '@/core';
import { replace, sortBy } from 'lodash';
import { DocumentWithWebkit } from '@/features/types';
import { FilterSet} from '@gen3/core';


const DAYS_IN_YEAR = 365.25;
declare const joinFilters: (a: FilterSet, b: FilterSet) => FilterSet;

export const toggleFullScreen = async (
  ref: React.MutableRefObject<any>,
): Promise<void> => {
  // Webkit vendor prefix for Safari support: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#browser_compatibility
  if (
    !document.fullscreenElement &&
    !(document as DocumentWithWebkit).webkitFullscreenElement
  ) {
    if (ref.current.requestFullscreen) {
      await ref.current.requestFullscreen();
    } else if (ref.current.webkitRequestFullScreen) {
      ref.current.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as DocumentWithWebkit).webkitExitFullscreen) {
      (document as DocumentWithWebkit).webkitExitFullscreen();
    }
  }
};

export const createKeyboardAccessibleFunction = (
  func: () => void,
): KeyboardEventHandler<any> => {
  return (e: React.KeyboardEvent<any>) => (e.key === 'Enter' ? func() : null);
};

export const capitalize = (original: string): string => {
  const customCapitalizations: any = {
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

export const truncateString = (str: string, n: number): string => {
  if (str.length > n) {
    return str.substring(0, n) + '...';
  } else {
    return str;
  }
};
export const externalLinkNames = {
  civic: 'CIViC',
  entrez_gene: 'NCBI Gene',
  hgnc: 'HGNC',
  omim_gene: 'OMIM',
  uniprotkb_swissprot: 'UniProtKB Swiss-Prot',
};

export const geneExternalLinkNames = {
  civic: 'CIViC',
  entrez_gene: 'NCBI Gene',
  hgnc: 'HGNC',
  omim_gene: 'OMIM',
  uniprotkb_swissprot: 'UniProtKB Swiss-Prot',
};

export const externalLinks = {
  civic: (id: string): string => `https://civicdb.org/links/gene/${id}`,
  civicMutaton: (id: string): string =>
    `https://civicdb.org/links/variant/${id}`,
  cosm: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=${id}`,
  cosn: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/ncv/overview?id=${id}`,
  dbsnp: (id: string): string => `https://www.ncbi.nlm.nih.gov/snp/${id}`,
  ensembl: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
  entrez_gene: (id: string): string => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
  hgnc: (id: string): string =>
    `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`,
  omim_gene: (id: string): string => `http://omim.org/entry/${id}`,
  transcript: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
  uniprotkb_swissprot: (id: string): string =>
    `http://www.uniprot.org/uniprot/${id}`,
};

export const calculatePercentageAsNumber = (
  count: number,
  total: number,
): number => (count ? (count / total) * 100 : 0);

export const calculatePercentageAsString = (
  count: number,
  total: number,
): string => `${((count / total) * 100).toFixed(2)}%`;

export const allFilesInCart = (carts: CartFile[], files: CartFile[]): boolean =>
  files?.every((file) => carts.some((cart) => cart.file_id === file.file_id));

export const fileInCart = (cart: CartFile[], newId: string): boolean =>
  cart.map((f) => f.file_id).some((id) => id === newId);

/**
 *
 * @param givenObjects - Array of given objects
 * @param property - Property (string) which we want to base the comparison on
 * @returns the array of given objects (\@param givenObject) in ascending order based on the (\@param property)
 */
export const sortByPropertyAsc = <T>(
  givenObjects: Array<T>,
  property: string,
): Array<T> =>
  sortBy(givenObjects, [
    (e: any) => replace(e[property], /[^a-zA-Z]/g, '').toLocaleLowerCase(),
  ]);

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

export const extractToArray = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
): (string | number)[] => data?.map((x) => x[nodeKey]);

export const processFilters = (
  filter_A: FilterSet,
  filter_B: FilterSet,
): FilterSet | undefined =>
  !filter_A && !filter_B
    ? undefined
    : filter_A && !filter_B
      ? filter_A
      : !filter_A && filter_B
        ? filter_B
        : joinFilters(filter_B, filter_A);

/**
 * convert hooks 3 boolean status to DataStatus
 * @param isFetching -
 * @param isSuccess -
 * @param isError -
 */

export const statusBooleansToDataStatus = (
  isFetching: boolean,
  isSuccess: boolean,
  isError: boolean,
): DataStatus => {
  return isFetching
    ? 'pending'
    : isSuccess
      ? 'fulfilled'
      : isError
        ? 'rejected'
        : 'uninitialized';
};

export const focusStyles =
  'focus-visible:outline-none focus-visible:ring-offset-2 focus:ring-offset-white rounded-md focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-focusColor';

export const LG_BREAKPOINT = 1024;
export const XL_BREAKPOINT = 1280;
export const REPO_BREAKPOINT = 1420;

export const calculateStickyHeaderHeight = (): number => {
  const globalHeader = document.querySelector('#global-header');
  const contextBar = document.querySelector('#context-bar');
  return (
    (globalHeader?.getBoundingClientRect()?.height || 0) +
    (contextBar?.getBoundingClientRect()?.height || 0)
  );
};
