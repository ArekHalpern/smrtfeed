"use client";

import { useState } from "react";
import { Document } from "../page";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DocumentViewer({ document }: { document: Document }) {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < document.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-zinc-900 shadow-lg rounded-lg p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Page {currentPage + 1} of {document.pages.length}
        </h2>
        <div className="space-x-2">
          <Button onClick={prevPage} disabled={currentPage === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={nextPage}
            disabled={currentPage === document.pages.length - 1}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="bg-black p-4 rounded-md min-h-[60vh] overflow-y-auto">
        {document.pages[currentPage].sentences.map((sentence) => (
          <p key={sentence.sentenceNumber} className="mb-2">
            {sentence.content}
          </p>
        ))}
      </div>
    </div>
  );
}
