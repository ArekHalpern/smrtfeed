import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-end w-full">
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-4">Hello World</h2>
        <p className="text-lg text-center max-w-md">
          Welcome to smrtfeed. Toggle the theme using the button in the top
          right corner.
        </p>
      </main>
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
        © 2024 smrtfeed. All rights reserved.
      </footer>
    </div>
  );
}
