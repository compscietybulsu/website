"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { OFFICER_SLOTS, EXECUTIVE_SLOTS } from "@/lib/aboutContent";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

function LeadersContent() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/api/leaders")
            .then(setLeaders)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    function nameFor(key) {
        return leaders.find((l) => l.key === key)?.name;
    }

    function Row({ slot }) {
        return (
            <div className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4">
                <div>
                    <p className="font-heading font-semibold text-white">{slot.role}</p>
                    <p className="text-green-200/60 text-xs mt-1">
                        {loading ? "Loading..." : nameFor(slot.key) || "Not set yet"}
                    </p>
                </div>
                <Link href={`/admin/leaders/${slot.key}/edit`} className="text-green-300 text-sm hover:text-white shrink-0">
                    Edit
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
            <div className="mx-auto max-w-4xl">
                <AdminNav />
                <h1 className="font-heading font-extrabold text-white text-3xl mb-2">Officers & Executives</h1>
                <p className="text-green-200/50 text-xs mb-8">
                    These are fixed leadership roles — you can change who currently holds each one, but roles
                    themselves aren&apos;t added or removed here.
                </p>

                <p className="font-heading font-semibold text-green-300 text-sm mb-2">Officers</p>
                <div className="space-y-2 mb-8">
                    {OFFICER_SLOTS.map((slot) => (
                        <Row key={slot.key} slot={slot} />
                    ))}
                </div>

                <p className="font-heading font-semibold text-green-300 text-sm mb-2">Executives</p>
                <div className="space-y-2">
                    {EXECUTIVE_SLOTS.map((slot) => (
                        <Row key={slot.key} slot={slot} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LeadersAdminPage() {
    return (
        <AdminGuard>
            <LeadersContent />
        </AdminGuard>
    );
}