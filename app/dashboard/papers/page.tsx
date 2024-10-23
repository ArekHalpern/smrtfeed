"use client";

import { useState, useEffect } from "react";
import { PaperCard } from "./_components/PaperCard";
import { PaperModal, ExtendedPaper } from "./_components/PaperModal";
import { getPapers, updatePaper } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search } from "lucide-react";
import { AddPaperModal } from "./_components/AddPaperModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export default function PapersPage() {
  const [papers, setPapers] = useState<ExtendedPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ExtendedPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ExtendedPaper | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const fetchedPapers = await getPapers();
      setPapers(fetchedPapers as ExtendedPaper[]);
      setFilteredPapers(fetchedPapers as ExtendedPaper[]);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    const filtered = papers.filter((paper) =>
      paper.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPapers(filtered);
    setCurrentPage(1);
  }, [searchTerm, papers]);

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

  const handlePaperDelete = (deletedPaperId: string) => {
    setPapers(papers.filter((p) => p.id !== deletedPaperId));
    setSelectedPaper(null);
  };

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE);
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Saved Papers</h1>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <Button onClick={handleAddPaper}>
            <Plus className="mr-2 h-4 w-4" /> Add Paper
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <motion.div initial={false}>
          <AnimatePresence>
            {paginatedPapers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onClick={() => setSelectedPaper(paper)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {selectedPaper && (
        <PaperModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          onUpdate={handlePaperUpdate}
          onDelete={handlePaperDelete}
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
