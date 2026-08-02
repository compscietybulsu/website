"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import BlogForm from "@/components/admin/BlogForm";
import { api } from "@/lib/api";

function EditBlogContent() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/blogs/${id}`)
      .then(setBlog)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!blog) return <p className="text-green-200/70">Loading...</p>;

  return <BlogForm initialData={blog} blogId={id} />;
}

export default function EditBlogPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Edit Blog Post</h1>
          <EditBlogContent />
        </div>
      </div>
    </AdminGuard>
  );
}