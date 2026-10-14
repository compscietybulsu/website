// Client-safe helpers (no Cloudflare imports) for the Event Calendar UI.

export const STATUS_META = {
    ongoing: { label: "Ongoing", className: "bg-green-400/20 text-green-300 border-green-400/40", rank: 0 },
    upcoming: { label: "Upcoming", className: "bg-blue-400/20 text-blue-300 border-blue-400/40", rank: 1 },
    done: { label: "Done", className: "bg-white/10 text-green-100/60 border-white/20", rank: 2 },
};

// "YYYY-MM-DD" -> local Date (avoids the UTC shift of `new Date("YYYY-MM-DD")`).
function parseDay(value) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export function formatDay(value) {
    return parseDay(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatEventDates(startDate, endDate) {
    if (!endDate || endDate === startDate) return formatDay(startDate);
    return `${formatDay(startDate)} – ${formatDay(endDate)}`;
}

export function dayKey(year, month, day) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// YYYY-MM-DD strings compare correctly as plain strings.
export function eventCoversDay(event, key) {
    return event.startDate <= key && key <= (event.endDate || event.startDate);
}

export function sortEvents(events) {
    return [...events].sort((a, b) => {
        const byStatus = STATUS_META[a.status].rank - STATUS_META[b.status].rank;
        if (byStatus !== 0) return byStatus;
        // Finished events: most recent first. Others: soonest first.
        return a.status === "done"
            ? b.startDate.localeCompare(a.startDate)
            : a.startDate.localeCompare(b.startDate);
    });
}