import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { MainFeed } from "./MainFeed";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container flex gap-4 px-4 md:px-6 py-6">
        <Navigation />
        <MainFeed />
      </div>
    </div>
  );
}
