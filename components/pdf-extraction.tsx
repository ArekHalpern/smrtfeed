"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getDocument,
  GlobalWorkerOptions,
  // Remove PDFDocumentProxy as it's not used
  version,
} from "pdfjs-dist";
import { Upload } from "lucide-react";

// Set the worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface PDFExtractionProps {
  onExtract: (data: {
    id: string;
    source: string;
    pages: Array<{
      pageNumber: number;
      sentences: Array<{
        sentenceNumber: number;
        content: string;
      }>;
    }>;
  }) => void;
}

interface TextItem {
  str: string;
}

interface TextMarkedContent {
  // Add properties that TextMarkedContent might have
  type: string;
  // Add other properties as needed
}

const PDFExtraction: React.FC<PDFExtractionProps> = ({ onExtract }) => {
  const extractText = useCallback(
    async (file: File) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument(new Uint8Array(arrayBuffer)).promise;

        const documentData = {
          id: Date.now().toString(), // Use timestamp as a simple unique ID
          source: file.name,
          pages: [] as Array<{
            pageNumber: number;
            sentences: Array<{
              sentenceNumber: number;
              content: string;
            }>;
          }>,
        };

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: TextItem | TextMarkedContent) =>
              "str" in item ? item.str : ""
            )
            .join(" ");

          const pageData = {
            pageNumber: i,
            sentences: [] as Array<{ sentenceNumber: number; content: string }>,
          };

          // Split the page text into sentences
          const sentences = pageText.match(/[^.!?]+[.!?]+/g) || [];
          sentences.forEach((sentence, index) => {
            pageData.sentences.push({
              sentenceNumber: index + 1,
              content: sentence.trim(),
            });
          });

          documentData.pages.push(pageData);
        }

        onExtract(documentData);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    },
    [onExtract]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await extractText(file);
      }
    },
    [extractText]
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
};

export default PDFExtraction;
