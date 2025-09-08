import { JSONPath } from 'jsonpath-plus';

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


interface DownloadFromGuppyParams {
  params: Record<string, any>;
  done?: () => void;
}
export const download = async ({
  params,
  done
}: DownloadFromGuppyParams) => {

  await downloadFromGuppyToBlob({
    parameters: params,
    onDone: (data: Blob) => {
      handleDownload(data, params.filename);
      if (done) done();
    },
  });
}
