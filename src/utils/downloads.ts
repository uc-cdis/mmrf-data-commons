import { JSONPath } from 'jsonpath-plus';
import { getCookie } from 'cookies-next';
import {GuppyDownloadDataParams, GEN3_GUPPY_API, convertFilterSetToGqlFilter, DownloadFromGuppyParams, selectCSRFToken, coreStore,
  FilterSet, jsonToFormat, isJSONObject,
} from '@gen3/core';

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
const prepareUrl = (apiUrl: string) => `${apiUrl}/download`;

/**
 * Prepares a fetch configuration object for downloading files from Guppy.
 *
 * @param {GuppyDownloadDataParams} parameters - The parameters to include in the request body.
 * @param {string} csrfToken - The CSRF token to include in the request headers.
 * @returns {FetchConfig} - The prepared fetch configuration object.
 */
const prepareFetchConfig = (
  parameters: GuppyDownloadDataParams,
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
      type: parameters.type,
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
export const downloadFromGuppyToBlob = async ({
                                                parameters,
                                                onStart = () => null,
                                                onDone = (_: Blob) => null,
                                                onError = (_: Error) => null,
                                                onAbort = () => null,
                                                signal = undefined,
  isManifest = false,
                                              }: DownloadFromGuppyParams & { isManifest?: boolean}) => {
  const csrfToken = selectCSRFToken(coreStore.getState());
  onStart?.();

  const url = prepareUrl(GEN3_GUPPY_API);
  const fetchConfig = prepareFetchConfig(parameters, csrfToken);

  fetch(url.toString(), {
    ...fetchConfig,
    ...(signal ? { signal: signal } : {}),
  } as RequestInit)
    .then(async (response: Response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
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
          cases: x.cases, md5sum: x.md5sum,
            object_id: x.file_id
        }));
      }
      // convert the data to the specified format and return a Blob
      let str = '';
      if (parameters?.format === undefined || parameters.format === 'json' || isManifest) {
        str = JSON.stringify(jsonData);
      }
      else {
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
      // Abort is handle as an exception
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
                                                }: DownloadFromGuppyParams) => {
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
  index: string;
  filename: string;
  format: 'tsv' | 'json' |'csv';
  isManifest?: boolean;
}

interface DownloadParams {
  params: DownloadArgs;
  done?: () => void;
}
export const download = async ({
  params,
  done
}: DownloadParams) => {
    const { fields, cohortFilters, filters, index, filename, format, isManifest } = params;
    await downloadFromGuppyToBlob({
      parameters: {
        filter: filters,
        type: index,
        fields: fields,
        format: format
      },
    onDone: (data: Blob) => {
      handleDownload(data, filename);
      if (done) done();
    },
      isManifest: isManifest,
  });
}

export const downloadWithArgs = async (
  params: Record<string, any>,
done?: () => void
                              ) => {
  const { fields, cohortFilters, filters, index, filename, format, isManifest } = params;
  await downloadFromGuppyToBlob({
    parameters: {
      filter: filters,
      type: index,
      fields: fields,
      format: format
    },
    onDone: (data: Blob) => {
      handleDownload(data, filename);
      if (done) done();
    },
    isManifest: isManifest,
  });
}
