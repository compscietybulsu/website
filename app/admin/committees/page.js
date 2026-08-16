"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { COMMITTEES_META } from "@/lib/aboutContent";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

function CommitteesContent() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/committee-members")
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Remove this committee member?")) return;
    try {
      await api.delete(`/api/committee-members/${id}`, { token: getToken() });
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-extrabold text-white text-3xl">Committee Members</h1>
          <Link
            href="/admin/committees/new"
            className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
          >
            + Add Member
          </Link>
        </div>

        {loading && <p className="text-green-200/70">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <p className="text-green-200/50 text-xs mb-4">
          Committee Heads aren&apos;t listed here — they come from the officer roster and are edited in code
          (lib/aboutContent.js), since leadership changes once per academic year.
        </p>

        <div className="space-y-6">
          {COMMITTEES_META.map((committee) => {
            const committeeMembers = members.filter((m) => m.committeeSlug === committee.slug);
            return (
              <div key={committee.slug}>
                <p className="font-heading font-semibold text-green-300 text-sm mb-2">{committee.name}</p>
                <div className="space-y-2">
                  {committeeMembers.map((m) => (
                    <div
                      key={m._id}
                      className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-heading font-semibold text-white">{m.name}</p>
                        <p className="text-green-200/60 text-xs mt-1">{m.role}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <Link href={`/admin/committees/${m._id}/edit`} className="text-green-300 text-sm hover:text-white">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(m._id)} className="text-red-400 text-sm hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {committeeMembers.length === 0 && (
                    <p className="text-green-200/40 text-xs italic">No associates added yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CommitteesAdminPage() {
  return (
    <AdminGuard>
      <CommitteesContent />
    </AdminGuard>
  );
}