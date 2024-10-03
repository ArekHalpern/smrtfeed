"use client";

import { TweetComposer } from "./TweetComposer";
import { Tweet } from "./Tweet";
import { useState } from "react";

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

  const handleNewTweet = (content: string) => {
    const newTweet: TweetType = {
      id: tweets.length + 1,
      username: "AI Assistant",
      handle: "@ai_assistant",
      content,
      timestamp: "Just now",
    };
    setTweets([newTweet, ...tweets]);
  };

  return (
    <main className="flex-1 max-w-3xl">
      <TweetComposer onNewTweet={handleNewTweet} />
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </main>
  );
}
