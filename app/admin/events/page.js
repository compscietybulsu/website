"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import StatusBadge from "@/components/events/StatusBadge";
import { formatEventDates, sortEvents } from "@/lib/eventUtils";

function EventsContent() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .get("/api/events")
            .then((res) => setEvents(sortEvents(res)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleDelete(id) {
        if (!confirm("Delete this event?")) return;
        try {
            await api.delete(`/api/events/${id}`, { token: getToken() });
            setEvents((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
            <div className="mx-auto max-w-4xl">
                <AdminNav />

                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-heading font-extrabold text-white text-3xl">Events</h1>
                    <Link
                        href="/admin/events/new"
                        className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
                    >
                        + Add Event
                    </Link>
                </div>

                {loading && <p className="text-green-200/70">Loading...</p>}
                {error && <p className="text-red-400">{error}</p>}

                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event._id} className="rounded-xl bg-[#0d2818] p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <p className="font-heading font-semibold text-white">{event.title}</p>
                                    <StatusBadge status={event.status} />
                                    {event.featured && <span className="text-xs text-green-300">In carousel</span>}
                                </div>
                                <p className="text-green-200/60 text-xs mt-1">
                                    {formatEventDates(event.startDate, event.endDate)}
                                </p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <Link href={`/admin/events/${event._id}/edit`} className="text-green-300 text-sm hover:text-white">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(event._id)} className="text-red-400 text-sm hover:text-red-300">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && !error && events.length === 0 && (
                        <p className="text-green-200/60 text-sm">No events yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function EventsAdminPage() {
    return (
        <AdminGuard>
            <EventsContent />
        </AdminGuard>
    );
}