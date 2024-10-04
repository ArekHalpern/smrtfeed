"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface TweetComposerProps {
  onNewTweet: (tweet: string) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

export function TweetComposer({
  // onNewTweet,
  onGenerate,
  isGenerating,
}: TweetComposerProps) {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleGenerateTweet = async () => {
    setNotification(null);
    try {
      await onGenerate();
    } catch (error) {
      console.error("Failed to generate tweet:", error);
      setNotification({
        message: "Failed to generate tweet. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="border rounded-lg mb-4 p-3 md:p-4 bg-background text-foreground">
      <Textarea
        className="mb-2 bg-background text-foreground text-sm md:text-base"
        placeholder="What's happening?"
      />
      <div className="flex justify-end items-center">
        <Button
          onClick={handleGenerateTweet}
          disabled={isGenerating}
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
