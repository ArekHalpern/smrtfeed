import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Header } from "../app/feed/_components/Header";
import { Home, Upload } from "lucide-react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar>
          <SidebarBody>
            <SidebarLink
              link={{
                label: "Home",
                href: "/feed",
                icon: <Home className="w-4 h-4" />,
              }}
            />
            <SidebarLink
              link={{
                label: "Upload Papers",
                href: "/pdf-to-json-ui",
                icon: <Upload className="w-4 h-4" />,
              }}
            />
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 p-4 justify-center items-center">
          {children}
        </main>
      </div>
    </div>
  );
}
