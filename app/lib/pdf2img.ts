export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  // The legacy build is more tolerant across browsers, and we render
  // without a worker to avoid worker-loading failures in local setups.
  loadPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((lib) => {
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

async function renderPageToFile(
  page: any,
  fileName: string,
  scale: number,
): Promise<PdfConversionResult> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      imageUrl: "",
      file: null,
      error: "Canvas context is not available",
    };
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  await page.render({ canvasContext: context, viewport }).promise;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to create image blob",
          });
          return;
        }

        const imageFile = new File([blob], fileName, {
          type: "image/png",
        });

        resolve({
          imageUrl: URL.createObjectURL(blob),
          file: imageFile,
        });
      },
      "image/png",
      1,
    );
  });
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({
      data: arrayBuffer,
      disableWorker: true,
      useSystemFonts: true,
    }).promise;
    const page = await pdf.getPage(1);
    const fileName = `${file.name.replace(/\.pdf$/i, "")}.png`;
    const scales = [2, 1.5, 1];

    for (const scale of scales) {
      const result = await renderPageToFile(page, fileName, scale);
      if (result.file) {
        return result;
      }
    }

    return {
      imageUrl: "",
      file: null,
      error: "Failed to render PDF page",
    };
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: err instanceof Error ? err.message : "Unknown PDF conversion error",
    };
  }
}
