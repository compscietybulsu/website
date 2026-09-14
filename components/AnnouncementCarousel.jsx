"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GradientPillButton from "./ui/GradientPillButton";
import { useCachedFetch } from "@/lib/useCachedFetch";

const MAX_ITEMS = 3;
const AUTO_SCROLL_MS = 5000;

function excerpt(text, length = 120) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

function isExternalLink(link) {
  return /^https?:\/\//i.test(link || "");
}

export default function AnnouncementCarousel() {
  const { data: blogs, loading: blogsLoading } = useCachedFetch("blogs", "/api/blogs");
  const { data: announcements, loading: announcementsLoading } = useCachedFetch(
    "announcements",
    "/api/announcements"
  );
  const loading = blogsLoading || announcementsLoading;

  // Merge both sources into one shape, newest first, capped at MAX_ITEMS.
  // A blog post needs zero extra admin work to show up here — it just
  // appears alongside any dedicated Announcements automatically.
  const items = useMemo(() => {
    const fromBlogs = blogs.map((b) => ({
      id: `blog-${b._id}`,
      title: b.title,
      text: b.content,
      image: b.image,
      href: `/blog/${b._id}`,
      isExternal: false,
      createdAt: b.createdAt,
    }));
    const fromAnnouncements = announcements.map((a) => ({
      id: `announcement-${a._id}`,
      title: a.title,
      text: a.description,
      image: a.image,
      href: a.link || null,
      isExternal: isExternalLink(a.link),
      createdAt: a.createdAt,
    }));
    return [...fromBlogs, ...fromAnnouncements]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, MAX_ITEMS);
  }, [blogs, announcements]);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const safeIndex = items.length ? index % items.length : 0;
  const current = items[safeIndex];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const cardContent = current && (
    <>
      {current.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.image}
          alt={current.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/55 group-hover:bg-black/60 transition-colors" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <p className="font-heading font-bold text-lg sm:text-2xl text-white">{current.title}</p>
        <p className="mt-1 text-sm text-gray-200 max-w-md hidden sm:block">
          {excerpt(current.text)}
        </p>
      </div>
    </>
  );

  return (
    <section className="relative z-10 px-4 sm:px-8 -mt-16">
      <div
        className="mx-auto max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading && (
          <div className="h-48 sm:h-60 bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 space-y-2">
              <div className="h-5 w-1/2 bg-gray-400/70 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-400/50 rounded animate-pulse hidden sm:block" />
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="h-48 sm:h-60 bg-gray-200 flex items-center justify-center px-6 text-center">
            <p className="text-gray-600">No announcements or blog posts yet — check back soon.</p>
          </div>
        )}

        {!loading && current && (
          <>
            {current.href ? (
              current.isExternal ? (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative h-48 sm:h-60 bg-gray-800 group"
                >
                  {cardContent}
                </a>
              ) : (
                <Link href={current.href} className="block relative h-48 sm:h-60 bg-gray-800 group">
                  {cardContent}
                </Link>
              )
            ) : (
              <div className="relative h-48 sm:h-60 bg-gray-800 group">{cardContent}</div>
            )}

            {items.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {items.map((item, i) => (
                    <span
                      key={item.id}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === safeIndex ? "bg-white" : "bg-white/40"
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