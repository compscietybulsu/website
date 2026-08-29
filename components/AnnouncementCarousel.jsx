"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GradientPillButton from "./ui/GradientPillButton";
import { api } from "@/lib/api";

const MAX_ANNOUNCEMENTS = 5;
const AUTO_SCROLL_MS = 5000;

function excerpt(text, length = 200) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export default function AnnouncementCarousel() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api
      .get("/api/blogs")
      .then((data) => setBlogs(data.slice(0, MAX_ANNOUNCEMENTS)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (blogs.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % blogs.length);
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [blogs.length, isPaused]);

  const prev = () => setIndex((i) => (i - 1 + blogs.length) % blogs.length);
  const next = () => setIndex((i) => (i + 1) % blogs.length);
  const current = blogs[index];

  return (
    <section className="relative z-10 px-4 sm:px-8 -mt-16">
      <div
        className="mx-auto max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading && (
          <div className="aspect-[16/10] sm:aspect-[21/10] bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Loading announcements...</p>
          </div>
        )}

        {!loading && error && (
          <div className="aspect-[16/10] sm:aspect-[21/10] bg-gray-200 flex items-center justify-center px-6 text-center">
            <p className="text-gray-600">Couldn&apos;t load announcements right now.</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="aspect-[16/10] sm:aspect-[21/10] bg-gray-200 flex items-center justify-center px-6 text-center">
            <p className="text-gray-600">No announcements yet — check back soon.</p>
          </div>
        )}

        {!loading && !error && current && (
          <>
            {/* Using aspect ratio classes to maintain a natural image frame */}
            <Link href={`/blog/${current._id}`} className="block relative aspect-[16/10] sm:aspect-[21/10] bg-gray-800 group">
              {current.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.image}
                  alt={current.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent group-hover:from-black/90 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="font-heading font-bold text-lg sm:text-2xl text-white drop-shadow-md">
                  {current.title}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-white/95 leading-relaxed max-w-xl drop-shadow line-clamp-2 sm:line-clamp-3">
                  {excerpt(current.content, 220)}
                </p>
              </div>
            </Link>

            {blogs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Next announcement"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {blogs.map((b, i) => (
                    <span
                      key={b._id}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <GradientPillButton href="/blog">See More Announcements and Events</GradientPillButton>
      </div>
    </section>
  );
}