"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Header } from "../feed/_components/Header";
import { Home, Upload } from "lucide-react";
import { useState } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SidebarProvider open={sidebarOpen} setOpen={setSidebarOpen}>
        <div className="flex flex-1 pt-16">
          {" "}
          {/* Added pt-16 here */}
          <Sidebar className="sidebar">
            <SidebarBody className="h-full overflow-y-auto">
              <SidebarLink
                className="sidebar-link"
                link={{
                  label: "Home",
                  href: "/feed",
                  icon: <Home className="w-4 h-4" />,
                }}
              />
              <SidebarLink
                className="sidebar-link"
                link={{
                  label: "Upload Papers",
                  href: "/pdf-to-json-ui",
                  icon: <Upload className="w-4 h-4" />,
                }}
              />
              {/* Add more links as needed */}
            </SidebarBody>
          </Sidebar>
          <main className="flex-1 p-4 ml-[60px] transition-all duration-300 ease-in-out">
            <div className="container mx-auto flex justify-center items-start min-h-[calc(100vh-4rem)]">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
