import { getDB } from "./cf";
import { isValidHttpUrl, isValidImageUrl } from "./validation";

export const EVENT_STATUSES = ["ongoing", "upcoming", "done"];

/** @param {Record<string, unknown>} row */
export function mapEvent(row) {
    if (!row) return null;
    return {
        _id: row.id,
        title: row.title,
        description: row.description ?? "",
        content: row.content ?? "",
        image: row.image ?? "",
        location: row.location ?? "",
        link: row.link ?? "",
        startDate: row.start_date,
        endDate: row.end_date,
        status: row.status,
        featured: Boolean(row.featured),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/** True for a real calendar date written as YYYY-MM-DD. */
export function isValidDateString(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const d = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

const str = (v) => (typeof v === "string" ? v.trim() : "");

/**
 * Validates a create/update body.
 * @returns {{ error: string } | { value: object }}
 */
export function parseEventBody(body) {
    if (!body || typeof body !== "object") return { error: "Invalid JSON body" };

    const title = str(body.title);
    const description = str(body.description);
    const content = str(body.content);
    const image = str(body.image);
    const location = str(body.location);
    const link = str(body.link);
    const status = str(body.status);
    const startDate = str(body.startDate);
    const endDate = str(body.endDate) || startDate;
    const featured = body.featured === true;

    if (!title) return { error: "Title is required" };
    if (title.length > 200) return { error: "Title must not exceed 200 characters" };
    if (description.length > 500) return { error: "Summary must not exceed 500 characters" };
    if (location.length > 200) return { error: "Location must not exceed 200 characters" };
    if (!EVENT_STATUSES.includes(status)) {
        return { error: "Status must be ongoing, upcoming, or done" };
    }
    if (!isValidDateString(startDate)) return { error: "A valid start date is required" };
    if (!isValidDateString(endDate)) return { error: "End date is not a valid date" };
    if (endDate < startDate) return { error: "End date cannot be before the start date" };
    if (image && !isValidImageUrl(image)) return { error: "Invalid image URL format" };
    if (link && !isValidHttpUrl(link)) {
        return { error: "Invalid link (must start with http:// or https://)" };
    }

    return {
        value: { title, description, content, image, location, link, status, startDate, endDate, featured },
    };
}

/** @param {{ status?: string, featured?: boolean }} [filters] */
export async function listEvents({ status, featured } = {}) {
    const db = await getDB();
    const where = [];
    const binds = [];
    if (status && EVENT_STATUSES.includes(status)) {
        where.push("status = ?");
        binds.push(status);
    }
    if (featured) where.push("featured = 1");

    const sql = `SELECT * FROM events ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
               ORDER BY start_date ASC, created_at DESC`;
    const { results } = await db.prepare(sql).bind(...binds).all();
    return (results ?? []).map(mapEvent);
}

export async function getEvent(id) {
    const db = await getDB();
    const row = await db.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
    return mapEvent(row);
}

export async function createEvent(e) {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db
        .prepare(
            `INSERT INTO events
         (id, title, description, content, image, location, link, start_date, end_date, status, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(id, e.title, e.description, e.content, e.image, e.location, e.link,
            e.startDate, e.endDate, e.status, e.featured ? 1 : 0)
        .run();
    return getEvent(id);
}

export async function updateEvent(id, e) {
    const db = await getDB();
    const result = await db
        .prepare(
            `UPDATE events
       SET title = ?, description = ?, content = ?, image = ?, location = ?, link = ?,
           start_date = ?, end_date = ?, status = ?, featured = ?,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`
        )
        .bind(e.title, e.description, e.content, e.image, e.location, e.link,
            e.startDate, e.endDate, e.status, e.featured ? 1 : 0, id)
        .run();
    if (!result.meta?.changes) return null;
    return getEvent(id);
}

export async function deleteEvent(id) {
    const db = await getDB();
    const result = await db.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
    return (result.meta?.changes ?? 0) > 0;
}