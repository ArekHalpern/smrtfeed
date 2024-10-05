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

  const handleGenerateTweet = useCallback(
    async (paperIds: string[]) => {
      setIsGenerating(true);
      try {
        if (paperIds.length === 0) {
          const randomPaperId = await getRandomPaperId();
          if (!randomPaperId) {
            throw new Error("No papers available for selection.");
          }
          paperIds = [randomPaperId];
        }
        for (const paperId of paperIds) {
          const generatedTweet = await generateTweet(paperId);
          handleNewTweet(generatedTweet);
        }
      } catch (error) {
        console.error("Failed to generate tweet:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [handleNewTweet]
  );

  const refreshing = usePullToRefresh(() => handleGenerateTweet([]));

  const handleRefreshInsights = useCallback(async (tweetId: number) => {
    // Implement the refresh insights functionality here
    console.log(`Refreshing insights for tweet ${tweetId}`);
    // You can add the actual implementation later
  }, []);

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
          <Tweet
            key={tweet.id}
            {...tweet}
            onRefreshInsights={handleRefreshInsights}
          />
        ))}
      </div>
    </div>
  );
}
