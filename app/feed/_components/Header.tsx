import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="container flex items-center justify-between h-14 px-4">
        <h1 className="text-xl font-bold">SmrtFeed</h1>
        <div className="relative w-full max-w-sm mx-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search " type="search" />
        </div>
        <Avatar>
          <AvatarImage alt="User" src="/placeholder-user.jpg" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
