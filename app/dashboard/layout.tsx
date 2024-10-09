import { createClient } from "@/lib/auth/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
