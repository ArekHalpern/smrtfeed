import Link from "next/link";
import { Home, Upload, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b h-16">
      <div className="container flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-bold">SmrtFeed</h1>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard/pdf-to-json-ui"
              className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Papers</span>
            </Link>
          </nav>
          <ThemeToggle />
          <User className="w-6 h-6 text-foreground/80" />{" "}
          {/* Placeholder for profile avatar */}
        </div>
      </div>
    </header>
  );
}
