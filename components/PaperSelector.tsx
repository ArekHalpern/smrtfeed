"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPapers } from "@/app/dashboard/feed/actions";

interface Paper {
  id: string;
  title: string;
  datePublished: Date;
}

export function PaperSelector() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  const fetchPapers = async () => {
    const fetchedPapers = await getPapers();
    setPapers(fetchedPapers);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {selectedPaperId ? "Change Paper" : "Select Paper"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Paper</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {papers.map((paper) => (
            <Button
              key={paper.id}
              onClick={() => setSelectedPaperId(paper.id)}
              variant={selectedPaperId === paper.id ? "default" : "outline"}
              className="w-full mb-2 flex flex-col items-start"
            >
              <span>{paper.title}</span>
              <span className="text-sm text-muted-foreground">
                Published: {new Date(paper.datePublished).toLocaleDateString()}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
