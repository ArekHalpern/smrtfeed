"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconFileText, IconHome, IconUpload } from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      <Sidebar>
        <SidebarBody className="w-[240px]">
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
            <SidebarLink
              link={{
                label: "Upload Papers",
                href: "/dashboard/pdf-to-json-ui",
                icon: <IconUpload size={20} />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
