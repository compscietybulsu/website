"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/events/EventCard";
import MonthGrid from "@/components/events/MonthGrid";
import FadeIn from "@/components/ui/FadeIn";
import { useCachedFetch } from "@/lib/useCachedFetch";
import { eventCoversDay, sortEvents, formatDay } from "@/lib/eventUtils";

const TABS = [
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "done", label: "Done" },
];

export default function EventsPage() {
    const { data, loading } = useCachedFetch("events", "/api/events");
    const [tab, setTab] = useState("all");
    const [selectedDay, setSelectedDay] = useState(null);

    const events = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const visible = useMemo(() => {
        let list = events;
        if (tab !== "all") list = list.filter((e) => e.status === tab);
        if (selectedDay) list = list.filter((e) => eventCoversDay(e, selectedDay));
        return sortEvents(list);
    }, [events, tab, selectedDay]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320]">
            <Navbar />
            <section className="px-4 sm:px-8 pt-14">
                <div className="mx-auto max-w-5xl">
                    <h1 className="font-heading font-extrabold text-white text-5xl sm:text-6xl mb-3">
                        Event Calendar
                    </h1>
                    <p className="text-green-400 text-sm sm:text-base mb-10">
                        See what CompSciety is running now, what&apos;s coming up, and what you missed.
                    </p>

                    <div className="mb-10 max-w-md">
                        <MonthGrid events={events} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        {TABS.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setTab(t.value)}
                                className={`rounded-full px-5 py-2 text-sm font-heading font-semibold transition-colors ${tab === t.value
                                        ? "bg-gradient-to-r from-blue-500 to-green-400 text-white"
                                        : "bg-[#0d2818] text-green-200/70 hover:text-white"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                        {selectedDay && (
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="text-green-300 text-sm hover:text-white"
                            >
                                Showing {formatDay(selectedDay)} — clear
                            </button>
                        )}
                    </div>

                    {loading && <p className="text-green-200/70">Loading events...</p>}
                    {!loading && visible.length === 0 && (
                        <p className="text-green-200/70">No events match this view.</p>
                    )}

                    {visible.map((event, i) => (
                        <FadeIn key={event._id} delay={i * 80}>
                            <EventCard event={event} />
                        </FadeIn>
                    ))}
                </div>
            </section>

            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
}