"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ImageUploader from "./ImageUploader";

export default function LeaderForm({ leaderKey, roleLabel, initialData }) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || "");
    const [photo, setPhoto] = useState(initialData?.photo || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await api.put(`/api/leaders/${leaderKey}`, { name, photo }, { token: getToken() });
            router.push("/admin/leaders");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div>
                <p className="block text-sm font-heading font-semibold text-white mb-2">Role</p>
                <p className="text-green-200/70 text-sm">{roleLabel}</p>
                <p className="text-green-200/40 text-xs mt-1">
                    The role itself is fixed — you&apos;re editing who currently holds it.
                </p>
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

            <ImageUploader value={photo} onChange={setPhoto} label="Photo" />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex items-center gap-5">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <Link
                    href="/admin/leaders"
                    className="text-green-300 text-sm font-heading font-semibold hover:text-white transition-colors"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}