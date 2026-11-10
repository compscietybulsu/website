"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { api } from "@/lib/api";
import { googleCalendarUrl } from "@/lib/dates";
import { formatEventDates } from "@/lib/eventUtils";
import { toCalendarEvent } from "@/lib/useEvents";
import { useToday } from "@/lib/useToday";
import { plainText } from "@/lib/text";

export default function EventDetailsPage() {
  const { id } = useParams();
  const today = useToday();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/events/${id}`)
      .then((e) => setEvent(toCalendarEvent(e)))
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (event) document.title = `${plainText(event.title)} | CompSciety`;
  }, [event]);

  return (
    <SiteShell>
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs">
            <Link href="/">home</Link>/<Link href="/events">events</Link>/<span>event</span>
          </p>
        </div>
      </section>
      <div className="wrap page-body">
        {error && (
          <div className="empty glass">
            <b>We couldn&apos;t find that event</b>
            <span>It may have been removed. Head back to the calendar for what&apos;s on.</span>
            <Link className="btn btn-glass btn-sm" href="/events" style={{ marginTop: 8 }}>
              Back to events
            </Link>
          </div>
        )}
        {!event && !error && <div className="post glass skeleton" style={{ maxWidth: 760 }} />}
        {event && (
          <article className="article">
            <div className="meta">
              <span className="date">{formatEventDates(event.start, event.end)}</span>
              {event.location && <span className="tag">{event.location}</span>}
            </div>
            <h1>{plainText(event.title)}</h1>
            {event.image && (
              <div className="cover glass">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image} alt="" />
              </div>
            )}
            <div className="content">{plainText(event.content || event.description)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {event.link && (
                <a className="btn btn-primary btn-sm" href={event.link} target="_blank" rel="noopener noreferrer">
                  {event.link.includes("facebook.com") ? "View on Facebook ↗" : "Register / more info"}
                </a>
              )}
              {today && event.startDate > today && (
                <a className="btn btn-glass btn-sm" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                  Add to Google Calendar
                </a>
              )}
              <Link className="btn btn-glass btn-sm" href={`/events?date=${event.start}`}>
                Show on calendar
              </Link>
            </div>
          </article>
        )}
      </div>
    </SiteShell>
  );
}
