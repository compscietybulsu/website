"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/events/StatusBadge";
import { api } from "@/lib/api";
import { formatEventDates } from "@/lib/eventUtils";

export default function EventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .get(`/api/events/${id}`)
            .then(setEvent)
            .catch((err) => setError(err.message));
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] flex flex-col">
            <Navbar />

            <main className="flex-1 px-4 sm:px-8 pt-14 pb-20">
                <div className="mx-auto max-w-3xl">
                    <Link href="/events" className="text-green-400 text-sm hover:text-green-300 transition-colors">
                        ← Back to Event Calendar
                    </Link>

                    {error && <p className="text-red-400 mt-6">{error}</p>}
                    {!event && !error && <p className="text-green-200/70 mt-6">Loading...</p>}

                    {event && (
                        <article className="mt-6">
                            {event.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
                                />
                            )}
                            <StatusBadge status={event.status} />
                            <h1 className="font-heading font-extrabold text-white text-4xl sm:text-5xl mt-4 mb-4">
                                {event.title}
                            </h1>
                            <p className="text-green-300 font-heading font-semibold">
                                {formatEventDates(event.startDate, event.endDate)}
                            </p>
                            {event.location && <p className="text-green-200/70 text-sm mt-1 mb-6">{event.location}</p>}

                            <div className="text-green-100/80 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-6">
                                {event.content || event.description}
                            </div>

                            {event.link && (
                                <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-8 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity"
                                >
                                    Register / More Info
                                </a>
                            )}
                        </article>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}