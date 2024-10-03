"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { generateTweet, getPapers } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Remove this line:
// import { useTheme } from "next-themes";

interface Paper {
  id: string;
  title: string;
  datePublished: Date;
}

export function TweetComposer({
  onNewTweet,
}: {
  onNewTweet: (tweet: string) => void;
}) {
  // Remove this line:
  // const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      const fetchedPapers = await getPapers();
      setPapers(fetchedPapers);
    };
    fetchPapers();
  }, []);

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaperId(paper.id);
    setSelectedPaper(paper);
    setIsOpen(false);
  };

  const handleGenerateTweet = async () => {
    if (!selectedPaperId) {
      setNotification({
        message: "Please select a paper first.",
        type: "error",
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);
    try {
      const generatedTweet = await generateTweet(selectedPaperId);
      onNewTweet(generatedTweet);
      setNotification({
        message: "Tweet generated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to generate tweet:", error);
      setNotification({
        message: "Failed to generate tweet. Please try again.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg mb-4 p-4 bg-background text-foreground">
      <Textarea
        className="mb-2 bg-background text-foreground"
        placeholder="What's happening?"
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                {selectedPaper ? "Change Paper" : "Select Paper"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background text-foreground">
              <DialogHeader>
                <DialogTitle>Select a Paper</DialogTitle>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto">
                {papers.map((paper) => (
                  <div
                    key={paper.id}
                    className={`p-2 cursor-pointer ${
                      selectedPaperId === paper.id
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => handleSelectPaper(paper)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{paper.title}</span>
                      <span className="text-sm text-muted-foreground">
                        Published:{" "}
                        {new Date(paper.datePublished).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          {selectedPaper && (
            <div className="flex items-center text-sm font-medium px-2.5 py-0.5 rounded bg-secondary text-secondary-foreground">
              <span className="truncate max-w-[200px]">
                {selectedPaper.title}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateTweet}
            disabled={isGenerating || !selectedPaperId}
          >
            {isGenerating ? "Generating..." : "Generate Tweet"}
          </Button>
          <Button>Post</Button>
        </div>
      </div>
      {notification && (
        <div
          className={`mt-2 p-2 rounded ${
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
