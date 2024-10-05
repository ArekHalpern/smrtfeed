import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full p-8 sm:p-20">
      <header className="w-full flex justify-end mb-16">
        {/* Header content if needed */}
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold mb-4">Organize Your Research</h2>
        <p className="text-lg text-center max-w-md mb-8"></p>
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Start Now For Free
        </Link>
      </main>
      <footer className="w-full text-center text-sm text-gray-500 dark:text-gray-400 mt-16">
        © 2024 smrtfeed. All rights reserved.
      </footer>
    </div>
  );
}
