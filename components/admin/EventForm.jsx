"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ImageUploader from "./ImageUploader";

const INPUT =
    "w-full rounded-lg bg-[#0d2818] border border-green-800/50 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-green-400";
const LABEL = "block text-sm font-heading font-semibold text-white mb-2";

export default function EventForm({ initialData, eventId }) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [status, setStatus] = useState(initialData?.status || "upcoming");
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [multiDay, setMultiDay] = useState(
        Boolean(initialData && initialData.endDate !== initialData.startDate)
    );
    const [endDate, setEndDate] = useState(initialData?.endDate || "");
    const [location, setLocation] = useState(initialData?.location || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [image, setImage] = useState(initialData?.image || "");
    const [link, setLink] = useState(initialData?.link || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = {
                title,
                status,
                startDate,
                endDate: multiDay ? endDate : startDate,
                location,
                description,
                content,
                image,
                link,
                featured,
            };
            const token = getToken();
            if (eventId) {
                await api.put(`/api/events/${eventId}`, payload, { token });
            } else {
                await api.post("/api/events", payload, { token });
            }
            router.push("/admin/events");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div>
                <label htmlFor="event-title" className={LABEL}>Title</label>
                <input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} required className={INPUT} />
            </div>

            <div>
                <label htmlFor="event-status" className={LABEL}>Status</label>
                <select id="event-status" value={status} onChange={(e) => setStatus(e.target.value)} className={INPUT}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="event-start" className={LABEL}>{multiDay ? "Start date" : "Date"}</label>
                    <input id="event-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={INPUT} />
                </div>
                {multiDay && (
                    <div>
                        <label htmlFor="event-end" className={LABEL}>End date</label>
                        <input id="event-end" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} required className={INPUT} />
                    </div>
                )}
            </div>
            <label className="flex items-center gap-2 text-sm text-green-200/80">
                <input type="checkbox" checked={multiDay} onChange={(e) => setMultiDay(e.target.checked)} />
                This event runs over multiple days
            </label>

            <div>
                <label htmlFor="event-location" className={LABEL}>Location (optional)</label>
                <input id="event-location" value={location} onChange={(e) => setLocation(e.target.value)} className={INPUT} />
            </div>

            <div>
                <label htmlFor="event-description" className={LABEL}>Summary (shown on cards and the carousel)</label>
                <textarea id="event-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} className={INPUT} />
            </div>

            <div>
                <label htmlFor="event-content" className={LABEL}>Details (shown on the event page)</label>
                <textarea id="event-content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className={INPUT} />
            </div>

            <ImageUploader value={image} onChange={setImage} label="Event Image" />

            <div>
                <label htmlFor="event-link" className={LABEL}>Registration / info link (optional)</label>
                <input id="event-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://forms.gle/..." className={INPUT} />
            </div>

            <label className="flex items-center gap-2 text-sm text-green-200/80">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                Highlight in the home page announcements carousel
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex items-center gap-5">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-8 py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? "Saving..." : eventId ? "Update Event" : "Add Event"}
                </button>
                <Link href="/admin/events" className="text-green-300 text-sm font-heading font-semibold hover:text-white transition-colors">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
