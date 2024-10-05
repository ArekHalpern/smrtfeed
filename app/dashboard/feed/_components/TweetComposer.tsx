"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TweetComposerProps {
  onNewTweet: (tweet: string) => void;
  onGenerate: (paperIds: string[]) => Promise<void>;
  isGenerating: boolean;
}

interface Paper {
  id: string;
  title: string;
}

export function TweetComposer({
  onGenerate,
  isGenerating,
}: TweetComposerProps) {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch((error) => console.error("Failed to fetch papers:", error));
  }, []);

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateTweet = async () => {
    setNotification(null);
    try {
      await onGenerate(selectedPapers.map((paper) => paper.id));
      setSelectedPapers([]);
    } catch (error) {
      console.error("Failed to generate tweet:", error);
      setNotification({
        message: "Failed to generate tweet. Please try again.",
        type: "error",
      });
    }
  };

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPapers((prev) => {
      const isAlreadySelected = prev.some((p) => p.id === paper.id);
      if (isAlreadySelected) {
        return prev.filter((p) => p.id !== paper.id);
      } else {
        return [...prev, paper];
      }
    });
  };

  const handleClearSelection = (paperId: string) => {
    setSelectedPapers((prev) => prev.filter((p) => p.id !== paperId));
  };

  return (
    <div className="border rounded-lg mb-4 p-3 md:p-4 bg-background text-foreground">
      <Textarea
        className="mb-2 bg-background text-foreground text-sm md:text-base"
        placeholder="What's happening?"
      />
      <div className="flex justify-between items-center mb-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              Select Papers
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Papers</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ScrollArea className="mt-2 max-h-[300px] pr-4">
              {filteredPapers.map((paper) => (
                <Button
                  key={paper.id}
                  variant={
                    selectedPapers.some((p) => p.id === paper.id)
                      ? "secondary"
                      : "outline"
                  }
                  className="w-full justify-start mb-2"
                  onClick={() => handlePaperSelect(paper)}
                >
                  {paper.title}
                </Button>
              ))}
            </ScrollArea>
            <DialogClose asChild>
              <Button className="mt-2">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleGenerateTweet}
          disabled={isGenerating || selectedPapers.length === 0}
          size="sm"
          className="text-xs md:text-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Insights"
          )}
        </Button>
      </div>
      {selectedPapers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPapers.map((paper) => (
            <div
              key={paper.id}
              className="flex items-center bg-muted p-1 rounded-md"
            >
              <span className="text-xs md:text-sm truncate max-w-[150px]">
                {paper.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClearSelection(paper.id)}
                className="ml-1 h-5 w-5 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {notification && (
        <div
          className={`mt-2 p-2 rounded text-xs md:text-sm ${
            notification.type === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
