"use client";

import { User, Home, Scroll } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/auth/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

const NavLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Home;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center space-x-1 text-sm text-foreground/80 hover:text-foreground transition-colors"
  >
    <Icon size={16} />
    <span>{children}</span>
  </Link>
);

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b h-16">
      <div className="container flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            smrtfeed.
          </Link>
          {user && (
            <nav className="hidden md:flex space-x-4">
              <NavLink href="/dashboard/feed" icon={Home}>
                Home
              </NavLink>

              <NavLink href="/dashboard/papers" icon={Scroll}>
                Papers
              </NavLink>
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6 text-foreground/80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Get Started For Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
