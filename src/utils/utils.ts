import React, { KeyboardEventHandler } from 'react';
import { CartFile, GdcFile, DataStatus } from '../core';
import { replace, sortBy } from 'lodash';
import { DocumentWithWebkit } from '@/features/types';

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  func: Function,
): KeyboardEventHandler<any> => {
  return (e: React.KeyboardEvent<any>) => (e.key === 'Enter' ? func() : null);
};
/* eslint-enable */

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

export const extractToArray = (
  data: ReadonlyArray<Record<string, number | string>>,
  nodeKey: string,
): (string | number)[] => data?.map((x) => x[nodeKey]);

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

export const getAnnotationsLinkParamsFromFiles = (
  file: GdcFile,
): string | null => {
  // Due to limitation in the length of URI, we decided to cap a link to be created for files which has < 150 annotations for now
  // 150 annotations was a safe number. It was tested in Chrome, Firefox, Safari and Edge.
  // TODO: Follow Up Ticket - https://jira.opensciencedatacloud.org/browse/PEAR-758
  const MAX_ANNOATATION_COUNT = 150;
  if (!file?.annotations || file.annotations.length > MAX_ANNOATATION_COUNT)
    return null;

  if (file?.annotations?.length === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${file.annotations[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.annotation_id","value":[${[
    file.annotations.map((annotation) => `"${annotation.annotation_id}"`),
  ]}]},"op":"in"}],"op":"and"}`;
};
