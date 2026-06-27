import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) {
    return true;
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" || ext === "heif";
}

export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82,
): Promise<File> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const isHeic =
    ext === "heic" || ext === "heif" || file.type === "image/heic" || file.type === "image/heif";

  let workingFile = file;

  if (isHeic) {
    console.log(`[HEIC Conversion] Converting "${file.name}" to JPEG...`);
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default;

      const conversionResult = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85,
      });
      const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      workingFile = new File([blob], `${nameWithoutExt}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      console.log(
        `[HEIC Conversion] Converted successfully! New type: ${workingFile.type}, size: ${(workingFile.size / 1024 / 1024).toFixed(2)} MB`,
      );
    } catch (error) {
      console.error("[HEIC Conversion] Failed to convert HEIC:", error);
    }
  }

  return new Promise((resolve) => {
    // Only compress image files
    if (!workingFile.type.startsWith("image/")) {
      return resolve(workingFile);
    }

    // Don't compress SVGs or GIFs to avoid losing vector property/animation
    if (workingFile.type === "image/svg+xml" || workingFile.type === "image/gif") {
      return resolve(workingFile);
    }

    const reader = new FileReader();
    reader.readAsDataURL(workingFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(workingFile);
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP for modern compression, fallback to JPEG if needed
        const exportType = "image/webp";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Replace extension with webp
              const originalName = workingFile.name;
              const nameWithoutExt =
                originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
              const newName = `${nameWithoutExt}.webp`;

              const compressedFile = new File([blob], newName, {
                type: exportType,
                lastModified: Date.now(),
              });

              // Only return compressed file if it's actually smaller than the original!
              if (compressedFile.size < workingFile.size) {
                console.log(
                  `[Compression] Compressed "${workingFile.name}" from ${(workingFile.size / 1024 / 1024).toFixed(2)} MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
                );
                resolve(compressedFile);
              } else {
                console.log(
                  `[Compression] Kept original "${workingFile.name}" as compression didn't save space.`,
                );
                resolve(workingFile);
              }
            } else {
              resolve(workingFile);
            }
          },
          exportType,
          quality,
        );
      };
      img.onerror = () => resolve(workingFile);
    };
    reader.onerror = () => resolve(workingFile);
  });
}

/**
 * Compresses document files (txt, pdf, doc, docx, etc.) client-side using native CompressionStream (gzip)
 * if they are larger than 150KB and supported by the browser.
 */
export async function compressDocument(file: File): Promise<{ file: File; isCompressed: boolean }> {
  // Only compress files larger than 150KB to avoid overhead on tiny files,
  // and check if CompressionStream is supported in the browser environment.
  if (file.size > 150 * 1024 && typeof CompressionStream !== "undefined") {
    try {
      console.log(
        `[Document Compression] Compressing "${file.name}" (Original: ${(file.size / 1024).toFixed(2)} KB)...`,
      );

      const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
      const response = new Response(stream);
      const blob = await response.blob();

      // Create a compressed File object with the same name and metadata
      const compressedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      console.log(
        `[Document Compression] Compressed successfully! New size: ${(compressedFile.size / 1024).toFixed(2)} KB (Saved ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%)`,
      );

      return { file: compressedFile, isCompressed: true };
    } catch (error) {
      console.error("[Document Compression] Failed to compress document:", error);
    }
  }
  return { file, isCompressed: false };
}
