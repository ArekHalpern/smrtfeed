import { createClient } from "@/lib/auth/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconFileText, IconHome } from "@tabler/icons-react";

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
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full">
      <Sidebar>
        <SidebarBody className="w-full md:w-[240px]">
          <div className="space-y-4">
            <SidebarLink
              link={{
                label: "Home",
                href: "/dashboard/feed",
                icon: <IconHome size={20} />,
              }}
            />
            <SidebarLink
              link={{
                label: "Papers",
                href: "/dashboard/papers",
                icon: <IconFileText size={20} />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
