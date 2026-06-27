import sharp from "sharp";
import { cleanGoogleDriveUrl } from "./db";

export interface CompressionResult {
  base64Data: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  format: string;
}

export async function compressImageFromUrl(imageUrl: string): Promise<CompressionResult> {
  const cleanedUrl = cleanGoogleDriveUrl(imageUrl);

  console.log(`[Image Server] Fetching image from: ${cleanedUrl}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

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
    throw new Error(`Failed to download image (HTTP ${response.status}: ${response.statusText})`);
  }

  const contentType = response.headers.get("content-type") || "";

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalSizeKb = buffer.length / 1024;

  console.log(
    `[Image Server] Downloaded image size: ${originalSizeKb.toFixed(2)} KB, Content-Type: ${contentType}`,
  );

  if (
    contentType.includes("html") ||
    buffer.toString("utf8", 0, 100).trim().startsWith("<!doctype html")
  ) {
    throw new Error(
      "The URL returned an HTML page (possibly Google Drive login/access-denied redirect) instead of a raw image. Please ensure the link is shared as 'Anyone with the link can view'.",
    );
  }

  // Load image with sharp to read metadata
  const sharpImg = sharp(buffer);
  const metadata = await sharpImg.metadata();

  let finalBuffer = buffer;
  let exportFormat = metadata.format || "webp";

  // Check if we should convert to webp (skip vector graphics and animated gifs to preserve quality/motion)
  if (metadata.format !== "svg" && metadata.format !== "gif") {
    console.log(`[Image Server] Compressing and converting to WebP...`);
    finalBuffer = await sharp(buffer)
      .resize(1600, 1600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
    exportFormat = "webp";
  }

  const compressedSizeKb = finalBuffer.length / 1024;
  console.log(
    `[Image Server] Compression complete: ${originalSizeKb.toFixed(2)} KB -> ${compressedSizeKb.toFixed(2)} KB`,
  );

  const base64Data = `data:image/${exportFormat};base64,${finalBuffer.toString("base64")}`;

  return {
    base64Data,
    originalSizeKb,
    compressedSizeKb,
    format: exportFormat,
  };
}
