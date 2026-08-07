"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

function DashboardContent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/blogs")
      .then(setBlogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this blog post?")) return;
    try {
      await api.delete(`/api/blogs/${id}`, { token: getToken() });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-extrabold text-white text-3xl">Blogs</h1>
          <Link
            href="/admin/blogs/new"
            className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
          >
            + Add Blog
          </Link>
        </div>

        {loading && <p className="text-green-200/70">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-semibold text-white">{blog.title}</p>
                <p className="text-green-200/60 text-xs mt-1">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href={`/admin/blogs/${blog._id}/edit`} className="text-green-300 text-sm hover:text-white">
                  Edit
                </Link>
                <button onClick={() => handleDelete(blog._id)} className="text-red-400 text-sm hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && blogs.length === 0 && (
            <p className="text-green-200/60 text-sm">No blog posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}