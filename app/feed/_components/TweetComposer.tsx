"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { generateTweet } from "../actions";

export function TweetComposer({
  onNewTweet,
}: {
  onNewTweet: (tweet: string) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleGenerateTweet = async () => {
    console.log("Generate Tweet button clicked"); // Add this line
    setIsGenerating(true);
    setNotification(null);
    try {
      console.log("Calling generateTweet function"); // Add this line
      const generatedTweet = await generateTweet();
      console.log("Generated tweet:", generatedTweet); // Add this line
      onNewTweet(generatedTweet);
      if (generatedTweet.startsWith("Sorry,")) {
        setNotification({ message: generatedTweet, type: "error" });
      } else {
        setNotification({
          message: "Tweet generated successfully!",
          type: "success",
        });
      }
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
    <div className="border rounded-lg mb-4 p-4">
      <Textarea className="mb-2" placeholder="What's happening?" />
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <Image
              src="/image-icon.svg"
              alt="Attach image"
              width={16}
              height={16}
            />
            <span className="sr-only">Attach image</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateTweet} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Tweet"}
          </Button>
          <Button>Post</Button>
        </div>
      </div>
      {notification && (
        <div
          className={`mt-2 p-2 rounded ${
            notification.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
