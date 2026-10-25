"use client";

import Link from "next/link";
import { MONTHS_SHORT, googleCalendarUrl, relative } from "@/lib/dates";
import { SERVE } from "@/lib/useEvents";

function Status({ event, today }) {
  const s = event.startDate;
  if (!today) return <span className="status" />;
  if (event.status === "ongoing") return <span className="status now">happening now</span>;
  if (s > today) return <span className="status up">upcoming · {relative(s, today)}</span>;
  if (event.endDate >= today) return <span className="status now">happening now</span>;
  return null;
}

export function DateTile({ event }) {
  const s = event.startDate;
  const multi = event.endDate > s;
  return (
    <div className="dtile" aria-hidden="true">
      <span>{MONTHS_SHORT[s.getMonth()].toUpperCase()}</span>
      <b className={multi ? "range" : ""}>
        {s.getDate()}
        {multi ? `–${event.endDate.getDate()}` : ""}
      </b>
      <small>{s.getFullYear()}</small>
    </div>
  );
}

export default function EventCard({ event, today, onShowOnCalendar }) {
  return (
    <article className="ev glass spot">
      <DateTile event={event} />
      <div className="ev-main">
        <div className="meta">
          <span className={`tag${SERVE.includes(event.kind) ? " g" : ""}`}>{event.kind}</span>
          <Status event={event} today={today} />
        </div>
        <h3>{event.title}</h3>
        <p>{event.summary}</p>
        <div className="ev-actions">
          <Link href={event.href}>Read more</Link>
          {today && event.startDate > today && (
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
              Add to Google Calendar
            </a>
          )}
          {onShowOnCalendar ? (
            <button type="button" onClick={() => onShowOnCalendar(event)}>
              Show on calendar
            </button>
          ) : (
            <Link href={`/events?date=${event.start}`}>Show on calendar</Link>
          )}
        </div>
      </div>
    </article>
  );
}
