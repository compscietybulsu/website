"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

function RegistrationsContent() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .get(`/api/events/${id}/registrations`, { token: getToken() })
            .then(setData)
            .catch((err) => setError(err.message));
    }, [id]);

    async function handleDelete(regId) {
        if (!confirm("Remove this registration?")) return;
        try {
            await api.delete(`/api/events/${id}/registrations/${regId}`, { token: getToken() });
            setData((d) => ({
                goingCount: d.goingCount - 1,
                registrations: d.registrations.filter((r) => r._id !== regId),
            }));
        } catch (err) {
            alert(err.message);
        }
    }

    if (error) return <p className="text-red-400">{error}</p>;
    if (!data) return <p className="text-green-200/70">Loading...</p>;

    return (
        <>
            <p className="text-green-200/70 text-sm mb-6">{data.goingCount} going</p>
            <div className="space-y-3">
                {data.registrations.map((r) => (
                    <div key={r._id} className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="font-heading font-semibold text-white">{r.name}</p>
                            <p className="text-green-200/60 text-xs mt-1 break-all">
                                {r.email}
                                {r.studentNumber && ` · ${r.studentNumber}`}
                                {` · email ${r.emailSent ? "sent" : "not sent"}`}
                            </p>
                        </div>
                        <button onClick={() => handleDelete(r._id)} className="text-red-400 text-sm hover:text-red-300 shrink-0">
                            Remove
                        </button>
                    </div>
                ))}
                {data.registrations.length === 0 && (
                    <p className="text-green-200/60 text-sm">No registrations yet.</p>
                )}
            </div>
        </>
    );
}

export default function EventRegistrationsPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
                <div className="mx-auto max-w-3xl">
                    <AdminNav />
                    <Link href="/admin/events" className="inline-block text-green-400 text-sm hover:text-green-300 transition-colors mb-4">
                        ← Back to Events
                    </Link>
                    <h1 className="font-heading font-extrabold text-white text-3xl mb-2">Registrations</h1>
                    <RegistrationsContent />
                </div>
            </div>
        </AdminGuard>
    );
}
