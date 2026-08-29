"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import LeaderForm from "@/components/admin/LeaderForm";
import { OFFICER_SLOTS, EXECUTIVE_SLOTS } from "@/lib/aboutContent";
import { api } from "@/lib/api";

const ALL_SLOTS = [...OFFICER_SLOTS, ...EXECUTIVE_SLOTS];

function EditLeaderContent() {
    const { key } = useParams();
    const [leader, setLeader] = useState(null);
    const [error, setError] = useState("");

    const slot = ALL_SLOTS.find((s) => s.key === key);

    useEffect(() => {
        api
            .get(`/api/leaders/${key}`)
            .then(setLeader)
            .catch((err) => setError(err.message));
    }, [key]);

    if (!slot) return <p className="text-red-400">Unknown role.</p>;
    if (error) return <p className="text-red-400">{error}</p>;
    if (!leader) return <p className="text-green-200/70">Loading...</p>;

    return <LeaderForm leaderKey={key} roleLabel={slot.role} initialData={leader} />;
}

export default function EditLeaderPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
                <div className="mx-auto max-w-2xl">
                    <AdminNav />
                    <Link
                        href="/admin/leaders"
                        className="inline-block text-green-400 text-sm hover:text-green-300 transition-colors mb-4"
                    >
                        ← Back to Officers & Executives
                    </Link>
                    <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Edit Role</h1>
                    <EditLeaderContent />
                </div>
            </div>
        </AdminGuard>
    );
}