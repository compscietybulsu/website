"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/blog/Pagination";
import { api } from "@/lib/api";

const PAGE_SIZE = 5;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/api/blogs?page=${page}&limit=${PAGE_SIZE}`)
      .then((data) => {
        if (cancelled) return;
        setBlogs(data.items);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  function handlePageChange(nextPage) {
    setLoading(true);
    setError("");
    setPage(nextPage);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320]">
      <Navbar />

      <section className="px-4 sm:px-8 pt-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-heading font-extrabold text-white text-5xl sm:text-6xl mb-3">Blog</h1>
          <p className="text-green-400 text-sm sm:text-base mb-14">
            Catch up with CompSciety&apos;s past events and upcoming events
          </p>

          {loading && <p className="text-green-200/70">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && blogs.length === 0 && (
            <p className="text-green-200/70">No blog posts yet — check back soon.</p>
          )}

          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      </section>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}