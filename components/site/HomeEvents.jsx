"use client";

import EventCard from "./EventCard";
import { useEvents } from "@/lib/useEvents";
import { useToday } from "@/lib/useToday";

// Next upcoming event (if any) followed by the most recent ones.
export default function HomeEvents({ count = 4 }) {
  const today = useToday();
  const { events, loading } = useEvents();
  const ALL = [...events].reverse();
  const upcoming = today ? ALL.filter((e) => e.endDate >= today).reverse() : [];
  const past = today ? ALL.filter((e) => e.endDate < today) : ALL;
  const list = [...upcoming.slice(0, 1), ...past].slice(0, count);
  if (!list.length) {
    return (
      <div className="empty glass">
        <b>{loading ? "Loading events…" : "Nothing announced yet"}</b>
        <span>The next event drops soon. Follow our Facebook page to hear first.</span>
      </div>
    );
  }
  return (
    <div className="evs two">
      {list.map((e) => (
        <EventCard key={e.id} event={e} today={today} />
      ))}
    </div>
  );
}
