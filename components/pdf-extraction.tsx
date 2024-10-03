"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  version,
} from "pdfjs-dist";
import { Upload } from "lucide-react";

// Set the worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface PDFExtractionProps {
  onExtract: (text: string) => void;
}

interface TextItem {
  str: string;
}

export function PDFExtraction({ onExtract }: PDFExtractionProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          try {
            const pdf: PDFDocumentProxy = await getDocument(typedarray).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item) => (item as TextItem).str)
                .join(" ");
              fullText += pageText + "\n";
            }
            onExtract(fullText.trim());
          } catch (error) {
            console.error("Error extracting text from PDF:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [onExtract]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div
      {...getRootProps()}
      className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-gray-400 transition-colors duration-200"
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-2">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="text-sm text-gray-600">Drop the PDF file here ...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Drag &apos;n&apos; drop a PDF file here
            </p>
            <p className="text-xs text-gray-500">or click to select a file</p>
          </>
        )}
      </div>
    </div>
  );
}
