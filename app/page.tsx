import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full p-4 sm:p-8 md:p-20">
      <header className="w-full flex justify-end mb-8 md:mb-16">
        {/* Header content if needed */}
      </header>
      <main className="flex flex-col items-center justify-center flex-grow text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Organize Your Research
        </h2>
        <p className="text-base md:text-lg max-w-md mb-8"></p>
        <Link
          href="/dashboard/feed"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm md:text-base"
        >
          Start Now For Free
        </Link>
      </main>
      <footer className="w-full text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-8 md:mt-16">
        © 2024 smrtfeed. All rights reserved.
      </footer>
    </div>
  );
}
