"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ImageUploader from "./ImageUploader";

export default function PartnerForm({ initialData, partnerId }) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [detail, setDetail] = useState(initialData?.detail || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      const payload = { name, detail, image };
      if (partnerId) {
        await api.put(`/api/partners/${partnerId}`, payload, { token });
      } else {
        await api.post("/api/partners", payload, { token });
      }
      router.push("/admin/partners");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Partner Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <div>
        <label className="block text-sm font-heading font-semibold text-white mb-2">Detail</label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={4}
          placeholder="A short description of this partner"
          className="w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
        />
      </div>

      <ImageUploader value={image} onChange={setImage} label="Partner Logo" />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : partnerId ? "Update Partner" : "Add Partner"}
        </button>
        <Link
          href="/admin/partners"
          className="text-green-300 text-sm font-heading font-semibold hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}