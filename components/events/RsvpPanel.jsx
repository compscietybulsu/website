"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "./rsvp.css";

export default function RsvpPanel({ event }) {
  const [summary, setSummary] = useState({ goingCount: 0, going: [] });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const open = event.registrationEnabled && event.status !== "done";

  function refresh() {
    return api.get(`/api/events/${event._id}/registrations`).then(setSummary).catch(() => {});
  }

  useEffect(() => {
    if (event.registrationEnabled) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event._id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await api.post(`/api/events/${event._id}/registrations`, { name, email, studentNumber, website });
      setDone(res.message);
      setName("");
      setEmail("");
      setStudentNumber("");
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!event.registrationEnabled) return null;

  return (
    <section className="rsvp glass" aria-labelledby="rsvp-title">
      <div>
        <span className="mono" style={{ color: "var(--blue-soft)" }}>rsvp</span>
        <h2 id="rsvp-title">Save your spot</h2>
        <p className="count">
          {summary.goingCount} {summary.goingCount === 1 ? "student is" : "students are"} going
        </p>
      </div>

      {done ? (
        <p className="coming-soon" role="status"><b>{done}</b></p>
      ) : open ? (
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" aria-label="Full name" autoComplete="name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email (we'll send your confirmation here)" aria-label="Email" autoComplete="email" />
          <input type="text" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} placeholder="Student number (optional)" aria-label="Student number" />
          <input className="hp" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {error && <p className="resend-msg err" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={saving} style={{ justifySelf: "start" }}>
            {saving ? "Registering…" : "I'm going"}
          </button>
        </form>
      ) : (
        <p className="count">Registration is closed for this event.</p>
      )}

      {summary.going.length > 0 && (
        <div>
          <p className="going-label">Going</p>
          <div className="going">
            {summary.going.map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
