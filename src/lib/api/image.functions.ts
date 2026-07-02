import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { compressImageFromUrl } from "../image.server";
import { compressDocumentFromUrl } from "../document.server";

export const compressExternalImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      console.log(`[Server Function] Starting compression for URL: ${data.url}`);
      const result = await compressImageFromUrl(data.url);
      return {
        success: true,
        ...result,
      };
    } catch (error: any) {
      console.error(`[Server Function] Compression failed for URL ${data.url}:`, error);
      return {
        success: false,
        error: error.message || "Failed to download and compress image on server",
      };
    }
  });

export const compressExternalDocument = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      console.log(`[Server Function] Starting document processing for URL: ${data.url}`);
      const result = await compressDocumentFromUrl(data.url);
      return {
        success: true,
        ...result,
      };
    } catch (error: any) {
      console.error(`[Server Function] Document processing failed for URL ${data.url}:`, error);
      return {
        success: false,
        error: error.message || "Failed to download and process document on server",
      };
    }
  });
