import { User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b h-16">
      <div className="container flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-bold">SmrtFeed</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <User className="w-6 h-6 text-foreground/80" />
        </div>
      </div>
    </header>
  );
}
