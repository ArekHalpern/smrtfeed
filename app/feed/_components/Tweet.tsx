import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreHorizontal, Repeat, Star } from "lucide-react";

interface TweetProps {
  id: number;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
}

export function Tweet({
  id,
  username,
  handle,
  content,
  timestamp,
}: TweetProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage alt={username} src={`/placeholder-user-${id}.jpg`} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{username}</span>
            <span className="text-muted-foreground">{handle}</span>
            <span className="text-muted-foreground">· {timestamp}</span>
          </div>
          <p className="mt-1">{content}</p>
          <div className="flex gap-4 mt-2">
            <Button size="icon" variant="ghost">
              <MessageCircle className="w-4 h-4" />
              <span className="sr-only">Reply</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Repeat className="w-4 h-4" />
              <span className="sr-only">Retweet</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Star className="w-4 h-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">More options</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
