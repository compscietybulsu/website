"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/announcements")
      .then(setAnnouncements)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/api/announcements/${id}`, { token: getToken() });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-extrabold text-white text-3xl">Announcements</h1>
          <Link
            href="/admin/announcements/new"
            className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
          >
            + Add Announcement
          </Link>
        </div>

        {loading && <p className="text-green-200/70">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading font-semibold text-white">{announcement.title}</p>
                <p className="text-green-200/60 text-xs mt-1">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link
                  href={`/admin/announcements/${announcement._id}/edit`}
                  className="text-green-300 text-sm hover:text-white"
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(announcement._id)} className="text-red-400 text-sm hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && announcements.length === 0 && (
            <p className="text-green-200/60 text-sm">No announcements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementsAdminPage() {
  return (
    <AdminGuard>
      <AnnouncementsContent />
    </AdminGuard>
  );
}
