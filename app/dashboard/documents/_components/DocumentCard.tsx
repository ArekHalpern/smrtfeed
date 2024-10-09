"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Document } from "../page";

export default function DocumentCard({ document }: { document: Document }) {
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

  if (!document.pages || document.pages.length === 0) {
    return (
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>{document.source}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No pages available for this document.</p>
        </CardContent>
      </Card>
    );
  }

  const currentPageData = document.pages[currentPage];

  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle>{document.source}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>
            Page {currentPage + 1} of {document.pages.length}
          </strong>
        </div>
        <div className="h-60 overflow-y-auto mb-4 bg-gray-900 p-4 rounded">
          {currentPageData && currentPageData.sentences ? (
            currentPageData.sentences.map((sentence) => (
              <p key={sentence.sentenceNumber} className="text-gray-300 mb-2">
                {sentence.content}
              </p>
            ))
          ) : (
            <p className="text-gray-300">No content available for this page.</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            onClick={prevPage}
            disabled={currentPage === 0}
            variant="outline"
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={nextPage}
            disabled={currentPage === document.pages.length - 1}
            variant="outline"
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
