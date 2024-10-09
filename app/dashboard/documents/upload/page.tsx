"use client";

import { useState } from "react";
import PDFExtraction from "@/components/pdf-extraction";
import { Button } from "@/components/ui/button";
import { saveDocument } from "./actions";

interface ExtractedDocument {
  id: string;
  source: string;
  pages: Array<{
    pageNumber: number;
    sentences: Array<{
      sentenceNumber: number;
      content: string;
    }>;
  }>;
}

export default function DocumentsPage() {
  const [extractedData, setExtractedData] = useState<ExtractedDocument | null>(
    null
  );

  const handleExtraction = (data: ExtractedDocument) => {
    setExtractedData(data);
  };

  const handleSave = async () => {
    if (extractedData) {
      try {
        await saveDocument(extractedData);
        alert("Document saved successfully!");
        setExtractedData(null);
      } catch (error) {
        console.error("Error saving document:", error);
        alert("Failed to save document. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Extraction</h1>
      <PDFExtraction onExtract={handleExtraction} />
      {extractedData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Extracted Data</h2>
          <pre className="bg-black text-white p-4 rounded-md overflow-auto max-h-60">
            {JSON.stringify(extractedData, null, 2)}
          </pre>
          <Button onClick={handleSave} className="mt-4">
            Save to Database
          </Button>
        </div>
      )}
    </div>
  );
}
