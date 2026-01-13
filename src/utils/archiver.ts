import { createTarPacker } from "modern-tar";

export interface VirtualFile {
  name: string;
  content: string;
}

/**
 * Generates a Gzipped TAR Blob from a list of virtual files.
 */

export const generateTarGzBlob = async (
  files: VirtualFile[],
): Promise<Blob> => {
  const { readable, controller } = createTarPacker();

  const packProcess = async () => {
    const encoder = new TextEncoder();

    for (const file of files) {
      const encodedData = encoder.encode(file.content);

      const entryStream = controller.add({
        name: file.name,
        size: encodedData.byteLength,
        type: "file",
      });

      const writer = entryStream.getWriter();
      await writer.write(encodedData);
      await writer.close();
    }

    controller.finalize();
  };

  packProcess().catch((err) => console.error("Tar packing error: ", err));

  let finalStream = readable;

  const gzip = new CompressionStream("gzip");
  finalStream = readable.pipeThrough(
    gzip as unknown as ReadableWritablePair<Uint8Array, Uint8Array>,
  );

  const response = new Response(finalStream, {
    headers: { "Content-Type": "application/gzip" },
  });

  return await response.blob();
};
