"use client";

import { TweetComposer } from "./TweetComposer";
import { Tweet } from "./Tweet";
import { useState } from "react";

export function MainFeed() {
  const [tweets, setTweets] = useState([
    {
      id: 1,
      username: "User 1",
      handle: "@user1",
      content: "This is a sample tweet 1. It could be about anything!",
      timestamp: "1h",
    },
    {
      id: 2,
      username: "User 2",
      handle: "@user2",
      content: "This is a sample tweet 2. It could be about anything!",
      timestamp: "2h",
    },
    {
      id: 3,
      username: "User 3",
      handle: "@user3",
      content: "This is a sample tweet 3. It could be about anything!",
      timestamp: "3h",
    },
  ]);

  const handleNewTweet = (content: string) => {
    const newTweet = {
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
