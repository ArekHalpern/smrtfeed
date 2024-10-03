import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, User } from "lucide-react";

export function Navigation() {
  return (
    <nav className="hidden lg:flex flex-col gap-4 w-1/5">
      <Button variant="ghost" className="justify-start">
        <Home className="mr-2" />
        Home
      </Button>
      <Button variant="ghost" className="justify-start">
        <Bell className="mr-2" />
        Notifications
      </Button>
      <Button variant="ghost" className="justify-start">
        <Bookmark className="mr-2" />
        Bookmarks
      </Button>
      <Button variant="ghost" className="justify-start">
        <User className="mr-2" />
        Profile
      </Button>
    </nav>
  );
}
