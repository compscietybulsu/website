import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createEvent, listEvents, parseEventBody } from "@/lib/events";

// GET /api/events?status=upcoming&featured=1 — public, soonest first.
export async function GET(request) {
    const params = new URL(request.url).searchParams;
    const events = await listEvents({
        status: params.get("status") || undefined,
        featured: params.get("featured") === "1",
    });
    return NextResponse.json(events);
}

export async function POST(request) {
    const admin = await requireAdmin(request);
    if (isAuthError(admin)) return admin;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = parseEventBody(body);
    if (parsed.error) {
        return NextResponse.json({ message: parsed.error }, { status: 400 });
    }
    const event = await createEvent(parsed.value);
    return NextResponse.json(event, { status: 201 });
}