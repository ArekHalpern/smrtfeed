import { TweetComposer } from "./TweetComposer";
import { Tweet } from "./Tweet";

export function MainFeed() {
  const tweets = [
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
  ];

  return (
    <main className="flex-1 max-w-3xl">
      <TweetComposer />
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </main>
  );
}
