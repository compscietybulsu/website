"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

export default function BlogArticlePage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/blogs/${id}`)
      .then(setBlog)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-8 pt-14 pb-20">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-green-400 text-sm hover:text-green-300 transition-colors">
            ← Back to Blog
          </Link>

          {error && <p className="text-red-400 mt-6">{error}</p>}
          {!blog && !error && <p className="text-green-200/70 mt-6">Loading...</p>}

          {blog && (
            <article className="mt-6">
              {blog.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
                />
              )}
              <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl mb-6">
                {blog.title}
              </h1>
              <div className="text-green-100/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>

              {blog.fbLink && (
                <a
                  href={blog.fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-8 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity"
                >
                  View on Facebook
                </a>
              )}
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}