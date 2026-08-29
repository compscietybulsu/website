"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { COMMITTEES_META } from "@/lib/aboutContent";
import ImageUploader from "./ImageUploader";

export default function CommitteeMemberForm({ initialData, memberId }) {
  const router = useRouter();
  const [committeeSlug, setCommitteeSlug] = useState(initialData?.committeeSlug || COMMITTEES_META[0].slug);
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [photo, setPhoto] = useState(initialData?.photo || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      const payload = { committeeSlug, name, role, photo };
      if (memberId) {
        await api.put(`/api/committee-members/${memberId}`, payload, { token });
      } else {
        await api.post("/api/committee-members", payload, { token });
      }
      router.push("/admin/committees");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Committee</label>
        <select
          value={committeeSlug}
          onChange={(e) => setCommitteeSlug(e.target.value)}
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        >
          {COMMITTEES_META.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Role</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          placeholder="e.g. Internal Audit Associate"
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <ImageUploader value={photo} onChange={setPhoto} label="Photo (optional)" />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : memberId ? "Update Member" : "Add Member"}
        </button>
        <Link
          href="/admin/committees"
          className="text-green-300 text-sm font-heading font-semibold hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}