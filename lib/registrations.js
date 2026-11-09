import { getDB } from "./cf";

export function isValidEmail(v) {
    return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** "Juan Dela Cruz" -> "Juan C." — safe for public display. */
export function maskName(name) {
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0] || "";
    const last = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : "";
    return `${first} ${last}`.trim();
}

export function mapRegistration(row) {
    if (!row) return null;
    return {
        _id: row.id,
        eventId: row.event_id,
        name: row.name,
        email: row.email,
        studentNumber: row.student_number ?? "",
        status: row.status,
        emailSent: Boolean(row.email_sent),
        createdAt: row.created_at,
    };
}

export async function countGoing(eventId) {
    const db = await getDB();
    const row = await db
        .prepare("SELECT COUNT(*) AS n FROM event_registrations WHERE event_id = ? AND status = 'going'")
        .bind(eventId)
        .first();
    return Number(row?.n ?? 0);
}

export async function listRegistrations(eventId) {
    const db = await getDB();
    const { results } = await db
        .prepare("SELECT * FROM event_registrations WHERE event_id = ? ORDER BY created_at ASC")
        .bind(eventId)
        .all();
    return (results ?? []).map(mapRegistration);
}

/** @returns {Promise<{ registration: object } | { duplicate: true }>} */
export async function createRegistration(eventId, { name, email, studentNumber = "" }) {
    const db = await getDB();
    const id = crypto.randomUUID();
    try {
        await db
            .prepare(
                `INSERT INTO event_registrations (id, event_id, name, email, student_number)
                 VALUES (?, ?, ?, ?, ?)`
            )
            .bind(id, eventId, name, email, studentNumber)
            .run();
    } catch (err) {
        if (String(err?.message || err).includes("UNIQUE")) return { duplicate: true };
        throw err;
    }
    const row = await db.prepare("SELECT * FROM event_registrations WHERE id = ?").bind(id).first();
    return { registration: mapRegistration(row) };
}

export async function markEmailSent(id) {
    const db = await getDB();
    await db.prepare("UPDATE event_registrations SET email_sent = 1 WHERE id = ?").bind(id).run();
}

export async function deleteRegistration(eventId, regId) {
    const db = await getDB();
    const r = await db
        .prepare("DELETE FROM event_registrations WHERE id = ? AND event_id = ?")
        .bind(regId, eventId)
        .run();
    return (r.meta?.changes ?? 0) > 0;
}
