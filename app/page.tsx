import { createClient } from "@/lib/auth/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]  px-4">
      <h1 className="text-4xl font-bold text-center mb-4">
        Organize Your Research
      </h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        Streamline your academic workflow. Effortlessly manage your papers,
        notes, and citations in one place.
      </p>
      {user ? (
        <Button asChild size="lg">
          <Link href="/dashboard/feed">Go to Dashboard</Link>
        </Button>
      ) : (
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
