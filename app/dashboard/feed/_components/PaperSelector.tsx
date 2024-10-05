import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Paper {
  id: string;
  title: string;
}

interface PaperSelectorProps {
  onSelect: (paperId: string) => void;
}

export function PaperSelector({ onSelect }: PaperSelectorProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch papers from your API
    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch((error) => console.error("Failed to fetch papers:", error));
  }, []);

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search papers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredPapers.map((paper) => (
          <Button
            key={paper.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelect(paper.id)}
          >
            {paper.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
