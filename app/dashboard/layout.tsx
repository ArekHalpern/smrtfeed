"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconFileText, IconHome } from "@tabler/icons-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("routeChangeStart", handleStart);
    window.addEventListener("routeChangeComplete", handleComplete);
    window.addEventListener("routeChangeError", handleComplete);

    return () => {
      window.removeEventListener("routeChangeStart", handleStart);
      window.removeEventListener("routeChangeComplete", handleComplete);
      window.removeEventListener("routeChangeError", handleComplete);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full">
      {isLoading && <LoadingSpinner />}
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
