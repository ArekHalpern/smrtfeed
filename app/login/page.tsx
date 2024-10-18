"use client";

import { login, signup } from "./action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if there's a success message in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    if (success === "true") {
      // If successful, navigate to the dashboard
      router.push("/dashboard/write");
    }
  }, [router]);

  const handleSubmit = async (action: typeof login | typeof signup) => {
    setError(null);
    try {
      await action(
        new FormData(document.querySelector("form") as HTMLFormElement)
      );
      // Instead of client-side navigation, reload the page with a success parameter
      window.location.href = "/login?success=true";
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Login or create an account
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" onClick={() => handleSubmit(login)}>
              Log in
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(signup)}
              variant="outline"
            >
              Sign up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
