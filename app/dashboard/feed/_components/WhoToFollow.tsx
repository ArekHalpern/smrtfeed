import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SuggestedUser {
  id: number;
  name: string;
  handle: string;
}

export function WhoToFollow() {
  const suggestedUsers: SuggestedUser[] = [
    { id: 1, name: "Suggested User 1", handle: "@suggested1" },
    { id: 2, name: "Suggested User 2", handle: "@suggested2" },
    { id: 3, name: "Suggested User 3", handle: "@suggested3" },
  ];

  return (
    <aside className="hidden xl:block w-1/4">
      <div className="border rounded-lg p-4">
        <h2 className="font-bold mb-2">Who to follow</h2>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  alt={user.name}
                  src={`/placeholder-user-${user.id + 3}.jpg`}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.handle}
                </div>
              </div>
              <Button size="sm">Follow</Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
