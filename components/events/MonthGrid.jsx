"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayKey, eventCoversDay } from "@/lib/eventUtils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// The current date is only read after mount so server and client markup match.
export default function MonthGrid({ events, selectedDay, onSelectDay }) {
    const [cursor, setCursor] = useState(null); // { year, month, today }

    useEffect(() => {
        queueMicrotask(() => {
            const now = new Date();
            setCursor({
                year: now.getFullYear(),
                month: now.getMonth(),
                today: dayKey(now.getFullYear(), now.getMonth(), now.getDate()),
            });
        });
    }, []);

    if (!cursor) return <div className="h-72 rounded-2xl bg-[#0d2818]/60" />;

    const { year, month, today } = cursor;
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [
        ...Array.from({ length: first.getDay() }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    function shift(delta) {
        const d = new Date(year, month + delta, 1);
        setCursor({ ...cursor, year: d.getFullYear(), month: d.getMonth() });
    }

    return (
        <div className="rounded-2xl bg-[#0d2818] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => shift(-1)} aria-label="Previous month" className="text-green-400 hover:text-green-300">
                    <ChevronLeft size={22} strokeWidth={3} />
                </button>
                <p className="font-heading font-bold text-white">
                    {first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
                <button onClick={() => shift(1)} aria-label="Next month" className="text-green-400 hover:text-green-300">
                    <ChevronRight size={22} strokeWidth={3} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-green-200/50 mb-1">
                {WEEKDAYS.map((w) => (
                    <span key={w}>{w}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    if (!day) return <span key={`blank-${i}`} />;
                    const key = dayKey(year, month, day);
                    const dayEvents = events.filter((e) => eventCoversDay(e, key));
                    const selected = selectedDay === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onSelectDay(selected ? null : key)}
                            disabled={dayEvents.length === 0}
                            aria-label={`${key}${dayEvents.length ? `, ${dayEvents.length} event(s)` : ""}`}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${selected
                                    ? "bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold"
                                    : dayEvents.length
                                        ? "bg-[#1a4d2e] text-white hover:bg-[#2d6b45]"
                                        : "text-green-200/40"
                                } ${key === today && !selected ? "ring-1 ring-green-400" : ""}`}
                        >
                            {day}
                            {dayEvents.length > 0 && !selected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
