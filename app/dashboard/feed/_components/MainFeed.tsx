"use client";

import { TweetComposer } from "./TweetComposer";
import { Tweet } from "./Tweet";
import { useState, useCallback } from "react";
import { usePullToRefresh } from "@/app/hooks/usePullToRefresh";
import { generateTweet, getRandomPaperId } from "../actions";
import { Loader2 } from "lucide-react";

// Define the Tweet type
interface TweetType {
  id: number;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
}

export function MainFeed() {
  // Specify the type for the tweets state
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNewTweet = useCallback(
    (content: string) => {
      const newTweet: TweetType = {
        id: tweets.length + 1,
        username: "AI Assistant",
        handle: "@ai_assistant",
        content,
        timestamp: "Just now",
      };
      setTweets((prevTweets) => [newTweet, ...prevTweets]);
    },
    [tweets]
  );

  const handleGenerateTweet = useCallback(async () => {
    setIsGenerating(true);
    try {
      const randomId = await getRandomPaperId();
      if (!randomId) {
        throw new Error("No papers available for random selection.");
      }
      const generatedTweet = await generateTweet(randomId);
      handleNewTweet(generatedTweet);
    } catch (error) {
      console.error("Failed to generate tweet:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [handleNewTweet]);

  const refreshing = usePullToRefresh(handleGenerateTweet);

  return (
    <div className="space-y-4">
      {refreshing && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Generating new insight...</span>
        </div>
      )}
      <TweetComposer
        onNewTweet={handleNewTweet}
        onGenerate={handleGenerateTweet}
        isGenerating={isGenerating}
      />
      <div className="space-y-3 md:space-y-4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </div>
  );
}
