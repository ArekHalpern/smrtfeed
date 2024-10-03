"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconFileText } from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="flex min-h-screen">
        <SidebarBody>
          <div className="space-y-4">
            <SidebarLink
              link={{
                label: "Papers",
                href: "/dashboard/papers",
                icon: <IconFileText size={20} />,
              }}
            />
          </div>
        </SidebarBody>
        <main className="flex-1 p-6 ml-[60px] md:ml-[300px]">{children}</main>
      </div>
    </Sidebar>
  );
}
