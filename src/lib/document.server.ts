import zlib from "node:zlib";
import { cleanGoogleDriveUrl } from "./db";

export interface DocumentCompressionResult {
  base64Data: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  isCompressed: boolean;
  contentType: string;
  fileName: string;
}

export async function compressDocumentFromUrl(docUrl: string): Promise<DocumentCompressionResult> {
  const cleanedUrl = cleanGoogleDriveUrl(docUrl);

  console.log(`[Document Server] Fetching document from: ${cleanedUrl}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  let response;
  try {
    response = await fetch(cleanedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(
        "Download timed out (Google Drive took too long to respond). Make sure the file is public.",
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Failed to download document (HTTP ${response.status}: ${response.statusText})`);
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const contentDisposition = response.headers.get("content-disposition") || "";

  // Try to parse filename from Content-Disposition
  let fileName = `doc-${Date.now()}`;
  const filenameMatch = contentDisposition.match(/filename\*?=(?:'[^']*')?"?([^";]+)"?/i);
  if (filenameMatch && filenameMatch[1]) {
    fileName = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
  } else {
    // Try to guess from URL
    try {
      const urlObj = new URL(cleanedUrl);
      const pathParts = urlObj.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart.includes(".")) {
        fileName = lastPart;
      }
    } catch {}
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalSizeKb = buffer.length / 1024;

  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const alreadyCompressedExts = ["docx", "doc", "pdf", "zip", "png", "jpg", "jpeg", "webp"];

  let finalBuffer = buffer;
  let isCompressed = false;

  // Compress using gzip if it is a text-based/compressible format and larger than 150KB
  if (!alreadyCompressedExts.includes(ext) && buffer.length > 150 * 1024) {
    console.log(`[Document Server] Compressing text document using gzip...`);
    finalBuffer = zlib.gzipSync(buffer);
    isCompressed = true;
  }

  const compressedSizeKb = finalBuffer.length / 1024;
  console.log(
    `[Document Server] Process completed: ${originalSizeKb.toFixed(2)} KB -> ${compressedSizeKb.toFixed(2)} KB (Compressed: ${isCompressed})`,
  );

  const base64Data = `data:${contentType};base64,${finalBuffer.toString("base64")}`;

  return {
    base64Data,
    originalSizeKb,
    compressedSizeKb,
    isCompressed,
    contentType,
    fileName,
  };
}
