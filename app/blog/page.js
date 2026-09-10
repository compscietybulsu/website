"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/blog/Pagination";
import FadeIn from "@/components/ui/FadeIn";
import { useCachedFetch } from "@/lib/useCachedFetch";

const PAGE_SIZE = 5;

function BlogCardSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-6 items-start mb-10">
      <div className="w-full aspect-[4/3] rounded-2xl bg-white/5 animate-pulse" />
      <div className="space-y-3">
        <div className="h-7 w-3/4 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
        <div className="h-10 w-32 bg-white/10 rounded-full animate-pulse mt-4" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { data: blogs, loading } = useCachedFetch("blogs", "/api/blogs");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const pageBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320]">
      <Navbar />
      <section className="px-4 sm:px-8 pt-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-heading font-extrabold text-white text-5xl sm:text-6xl mb-3">Blog</h1>
          <p className="text-green-400 text-sm sm:text-base mb-14">
            Catch up with CompSciety&apos;s past events and upcoming events
          </p>

          {loading && (
            <>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </>
          )}
          {!loading && blogs.length === 0 && (
            <p className="text-green-200/70">No blog posts yet — check back soon.</p>
          )}

          {pageBlogs.map((blog, i) => (
            <FadeIn key={blog._id} delay={i * 80}>
              <BlogCard blog={blog} />
            </FadeIn>
          ))}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}