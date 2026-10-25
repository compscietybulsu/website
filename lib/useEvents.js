"use client";

import { useMemo } from "react";
import { useCachedFetch } from "./useCachedFetch";
import { parseDay } from "./dates";

// The DB has no event type, so it's read from the title and description.
const KINDS = [
  ["competition", /sprint|hackathon|competition|contest|ctf|challenge/i],
  ["series", /series|bootcamp|linggo/i],
  ["workshop", /workshop|seminar|talk|training|webinar/i],
  ["outreach", /donation|\bdrive\b|outreach|charity|hatag|booth|membership|incubation|startup/i],
];
export const LEARNING = ["workshop", "series"];
export const SERVE = ["competition", "outreach"];

function kindOf(e) {
  const text = `${e.title} ${e.description}`;
  return KINDS.find(([, re]) => re.test(text))?.[0] || "event";
}

// Events come from the admin panel (/api/events). This adds real Date objects for the calendar.
export function toCalendarEvent(e) {
  const startDate = parseDay(e.startDate);
  return {
    ...e,
    id: e._id,
    kind: kindOf(e),
    summary: e.description,
    start: e.startDate,
    end: e.endDate || e.startDate,
    startDate,
    endDate: e.endDate ? parseDay(e.endDate) : startDate,
    href: `/events/${e._id}`,
  };
}

// All events, oldest first.
export function useEvents() {
  const { data, loading } = useCachedFetch("events", "/api/events");
  const events = useMemo(() => data.map(toCalendarEvent).sort((a, b) => a.startDate - b.startDate), [data]);
  return { events, loading };
}
