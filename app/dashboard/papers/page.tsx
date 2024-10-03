"use client";

import { useState, useEffect } from "react";
import { PaperCard } from "./_components/PaperCard";
import { PaperModal, ExtendedPaper } from "./_components/PaperModal";

import { getPapers, updatePaper } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddPaperModal } from "./_components/AddPaperModal";

export default function PapersPage() {
  const [papers, setPapers] = useState<ExtendedPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ExtendedPaper | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchPapers = async () => {
    const fetchedPapers = await getPapers();
    setPapers(fetchedPapers as ExtendedPaper[]); // Type assertion here
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handlePaperUpdate = async (updatedPaper: ExtendedPaper) => {
    const result = await updatePaper(updatedPaper);
    if (result.success) {
      setPapers(
        papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p))
      );
      setSelectedPaper(null);
    } else {
      console.error("Failed to update paper:", result.error);
    }
  };

  const handleAddPaper = () => {
    setIsAddModalOpen(true);
  };

  const handleAddPaperComplete = () => {
    setIsAddModalOpen(false);
    fetchPapers();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Papers</h1>
        <Button onClick={handleAddPaper}>
          <Plus className="mr-2 h-4 w-4" /> Add Paper
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            onClick={() => setSelectedPaper(paper)}
          />
        ))}
      </div>
      {selectedPaper && (
        <PaperModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          onUpdate={handlePaperUpdate}
        />
      )}
      <AddPaperModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onComplete={handleAddPaperComplete}
      />
    </div>
  );
}
