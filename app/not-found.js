import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-4 text-center">
        <svg
          viewBox="0 0 220 150"
          role="img"
          aria-label="Terminal window reporting a page not found"
          className="w-36 h-auto sm:w-40 mb-4"
        >
          <defs>
            <linearGradient id="not-found-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(20, 56, 34, 0.7)" />
              <stop offset="1" stopColor="rgba(8, 28, 17, 0.85)" />
            </linearGradient>
          </defs>
          <rect
            x="10" y="10" width="200" height="130" rx="14"
            fill="url(#not-found-glass)"
            stroke="rgba(34,197,94,0.3)"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="30" r="5" fill="rgba(248,113,113,0.75)" />
          <circle cx="50" cy="30" r="5" fill="rgba(250,204,21,0.75)" />
          <circle cx="68" cy="30" r="5" fill="rgba(74,222,128,0.75)" />
          <text x="30" y="64" fontFamily="monospace" fontSize="13" fill="#4ade80">$ whoami</text>
          <text x="30" y="84" fontFamily="monospace" fontSize="13" fill="#bbf7d0" opacity="0.85">compsciety@bulsu</text>
          <text x="30" y="104" fontFamily="monospace" fontSize="13" fill="#4ade80">$ visit /lost</text>
          <text x="30" y="124" fontFamily="monospace" fontSize="13" fill="#f87171">error 404: page not found</text>
          <rect x="46" y="130" width="7" height="12" rx="1" fill="#4ade80">
            <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
          </rect>
        </svg>

        <h1 className="font-heading font-extrabold text-white text-3xl sm:text-4xl mb-2">404</h1>
        <p className="text-green-200/80 text-xs sm:text-sm max-w-sm mb-4">
          Looks like this page wandered off the grid. Let&apos;s get you back home.
        </p>

        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold text-sm px-6 py-2.5 shadow-lg hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}