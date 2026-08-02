"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ImageUploader from "./ImageUploader";

export default function BlogForm({ initialData, blogId }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [fbLink, setFbLink] = useState(initialData?.fbLink || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      const payload = { title, content, image, fbLink };
      if (blogId) {
        await api.put(`/api/blogs/${blogId}`, payload, { token });
      } else {
        await api.post("/api/blogs", payload, { token });
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <ImageUploader value={image} onChange={setImage} />

      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">
          Facebook Post Link (optional)
        </label>
        <input
          value={fbLink}
          onChange={(e) => setFbLink(e.target.value)}
          placeholder="https://facebook.com/..."
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : blogId ? "Update Blog" : "Publish Blog"}
      </button>
    </form>
  );
}