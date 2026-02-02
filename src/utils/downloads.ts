import { JSONPath } from 'jsonpath-plus';
import { getCookie } from 'cookies-next';
import {
  GuppyDownloadDataParams,
  GEN3_GUPPY_API,
  convertFilterSetToGqlFilter,
  selectCSRFToken,
  coreStore,
  FilterSet,
  jsonToFormat,
  isJSONObject,
  GuppyActionParams,
} from '@gen3/core';
import { GEN3_ANALYSIS_API } from '@/core';

export type ActionButtonFunction = (
  done?: () => void,
  onError?: (error: Error) => void,
  onAbort?: () => void,
  signal?: AbortSignal,
  onCompleted?: (data: any) => void,
) => Promise<void>;

export type ActionButtonWithArgsFunction = (
  params: Record<string, any>,
  done?: (_?: Blob) => void,
  onError?: (error: Error) => void,
  onAbort?: () => void,
  signal?: AbortSignal,
  onCompleted?: (data: any) => void,
) => Promise<void>;

interface DownloadCohortDataParams extends GuppyDownloadDataParams {
  cohortFilters: FilterSet;
  caseIdField: string;
  isManifest?: boolean;
}

type DownloadFromAnalysisParams = GuppyActionParams<DownloadCohortDataParams>;

/**
 * Represents a configuration for making a fetch request.
 *
 * @typedef {Object} FetchConfig
 * @property {string} method - The HTTP method to use for the request.
 * @property {Object<string, string>} headers - The headers to include in the request.
 * @property {string} body - The request body.
 */
export type FetchConfig = {
  method: string;
  headers: Headers;
  body: string;
};

/**
 * Prepares a URL for downloading by appending '/download' to the provided apiUrl.
 *
 * @param {string} apiUrl - The base URL to be used for preparing the download URL.
 * @returns {URL} - The prepared download URL as a URL object.
 */
const prepareUrl = (apiUrl: string) => `${apiUrl}/cohorts/download`;

/**
 * Prepares a fetch configuration object for downloading files from Guppy.
 *
 * @param {GuppyDownloadDataParams} parameters - The parameters to include in the request body.
 * @param {string} csrfToken - The CSRF token to include in the request headers.
 * @returns {FetchConfig} - The prepared fetch configuration object.
 */
const prepareFetchConfig = (
  parameters: DownloadCohortDataParams,
  csrfToken?: string,
): FetchConfig => {
  const headers: Headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(csrfToken !== undefined && { 'X-CSRF-Token': csrfToken }),
  });

  if (process.env.NODE_ENV === 'development') {
    // NOTE: This cookie can only be accessed from the client side
    // in development mode. Otherwise, the cookie is set as httpOnly
    const accessToken = getCookie('credentials_token');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      index: parameters.type,
      case_ids_filter_path: parameters.caseIdField,
      cohort_filter: convertFilterSetToGqlFilter(parameters.cohortFilters),
      filter: convertFilterSetToGqlFilter(parameters.filter),
      accessibility: parameters.accessibility,
      fields: parameters?.fields,
      sort: parameters?.sort,
    }),
  };
};

/**
 * Downloads a file from Guppy using the provided parameters.
 * It will optionally convert the data to the specified format.
 *
 * @param {DownloadFromGuppyParams} parameters - The parameters to use for the download request.
 * @param onStart - The function to call when the download starts.
 * @param onDone - The function to call when the download is done.
 * @param onError - The function to call when the download fails.
 * @param onAbort - The function to call when the download is aborted.
 * @param signal - AbortSignal to use for the request.
 */
export const downloadFromGuppyToBlob: ActionButtonWithArgsFunction = async (
  parameters,
  onDone = (_?: Blob) => {},
  onError = (_: Error) => null,
  onAbort = () => null,
  signal = undefined,
) => {
  const csrfToken = selectCSRFToken(coreStore.getState());

  const url = prepareUrl(GEN3_ANALYSIS_API);
  const fetchConfig = prepareFetchConfig(
    parameters as DownloadCohortDataParams,
    csrfToken,
  );

  const isManifest = parameters?.isManifest;

  fetch(url.toString(), {
    ...fetchConfig,
    ...(signal ? { signal: signal } : {}),
  } as RequestInit)
    .then(async (response: Response) => {
      if (!response.ok) {
        onError?.(new Error(response.statusText));
        return;
      }

      let jsonData = await response.json();
      if (parameters?.rootPath && parameters.rootPath) {
        // if rootPath is provided, extract the data from the rootPath
        jsonData = JSONPath({
          json: jsonData,
          path: `$.[${parameters.rootPath}]`,
          resultType: 'value',
        });
      }

      if (isManifest) {
        jsonData = jsonData.map((x: any) => ({
          file_name: x.file_name,
          file_size: x.file_size,
          cases: x.cases,
          md5sum: x.md5sum,
          object_id: x.file_id,
        }));
      }
      // convert the data to the specified format and return a Blob
      let str = '';
      if (
        parameters?.format === undefined ||
        parameters.format === 'json' ||
        isManifest
      ) {
        str = JSON.stringify(jsonData);
      } else {
        try {
          const convertedData = await jsonToFormat(jsonData, parameters.format);
          if (isJSONObject(convertedData)) {
            str = JSON.stringify(convertedData, null, 2);
          } else {
            str = convertedData;
          }
        } catch (error) {
          console.error('Error converting data to format:', error);
          throw new Error('Error converting data to format');
        }
      }
      return new Blob([str], {
        type: 'application/json',
      });
    })
    .then((blob) => onDone?.(blob))
    .catch((error) => {
      // Abort is handled as an exception
      if (error.name == 'AbortError') {
        // handle abort()
        onAbort?.();
      }
      onError?.(error);
    });
};

export const downloadJSONDataFromGuppy = async ({
  parameters,
  onAbort = () => null,
  signal = undefined,
}: DownloadFromAnalysisParams) => {
  const csrfToken = selectCSRFToken(coreStore.getState());

  const url = prepareUrl(GEN3_GUPPY_API);
  const fetchConfig = prepareFetchConfig(parameters, csrfToken);
  try {
    const response = await fetch(url.toString(), {
      ...fetchConfig,
      ...(signal ? { signal: signal } : {}),
    } as RequestInit);

    let jsonData = await response.json();
    if (parameters?.rootPath && parameters.rootPath) {
      // if rootPath is provided, extract the data from the rootPath
      jsonData = JSONPath({
        json: jsonData,
        path: `$.[${parameters.rootPath}]`,
        resultType: 'value',
      });
    }
    // convert the data to the specified format and return a Blob
    return jsonData;
  } catch (error: any) {
    // Abort is handle as an exception
    if (error.name == 'AbortError') {
      // handle abort()
      onAbort?.();
    }
    throw new Error(error);
  }
};

/**
 * Handles downloading of a Blob object as a file.
 *
 * @param {Blob} data - The Blob object to be downloaded.
 * @param {string} filename - The name of the file to be saved.
 */
export const handleDownload = (data: Blob, filename: string) => {
  const aElement = document.createElement('a');
  const href = URL.createObjectURL(data);
  aElement.setAttribute('download', filename);
  aElement.href = href;
  aElement.setAttribute('target', '_blank');
  aElement.setAttribute('rel', 'noreferrer');
  aElement.click();
  URL.revokeObjectURL(href);
};

export interface DownloadArgs {
  fields: Array<string>;
  cohortFilters: FilterSet;
  filters: FilterSet;
  caseIdField: string;
  index: string;
  filename: string;
  format: 'tsv' | 'json' | 'csv';
  isManifest?: boolean;
  size?: number;
}

interface DownloadParams {
  params: DownloadArgs;
  done?: () => void;
  error?: (error: Error) => void;
  abort?: () => void;
}
export const download = async ({ params, done }: DownloadParams) => {
  const {
    fields,
    cohortFilters,
    filters,
    index,
    filename,
    format,
    isManifest,
    caseIdField,
  } = params;
  await downloadFromGuppyToBlob(
    {
      filter: filters,
      caseIdField,
      cohortFilters,
      type: index,
      fields: fields,
      format: format,
      isManifest: isManifest,
    },
    (data?: Blob) => {
      if (data) handleDownload(data, filename);
      if (done) done();
    },
    (error: Error) => {
      if (error) {
        console.error(error);
        if (error.message === 'AbortError') {
          console.warn('Aborted');
        } else {
          console.error('Error downloading file');
        }
      }
    },
    () => {
      console.warn('Aborted');
    },
  );
};

export const downloadWithArgs = async (
  params: Record<string, any>,
  done?: (_?: Blob) => void,
  onError?: (error: Error) => void,
  onAbort?: () => void,
  signal?: AbortSignal,
) => {
  const {
    fields,
    cohortFilters,
    filters,
    index,
    filename,
    format,
    isManifest,
    caseIdField,
  } = params;
  await downloadFromGuppyToBlob(
    {
      cohortFilters,
      caseIdField,
      filter: filters,
      type: index,
      fields: fields,
      format: format,
      isManifest: isManifest,
    },
    (data?: Blob) => {
      if (data) handleDownload(data, filename);
      if (done) done();
    },
    (error: Error) => {
      if (error) {
        if (error.message === 'AbortError') {
          if (onError)
            onError({ name: 'Abort', message: 'Download cancelled' });
        } else {
          console.error('Error downloading file', error.message);
        }
      }
    },
    () => {
      if (onAbort) onAbort();
    },
    signal,
  );
};
