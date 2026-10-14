import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deleteEvent, getEvent, parseEventBody, updateEvent } from "@/lib/events";

export async function GET(_request, { params }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
}

export async function PUT(request, { params }) {
    const admin = await requireAdmin(request);
    if (isAuthError(admin)) return admin;

    const { id } = await params;
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
    const event = await updateEvent(id, parsed.value);
    if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
}

export async function DELETE(request, { params }) {
    const admin = await requireAdmin(request);
    if (isAuthError(admin)) return admin;

    const { id } = await params;
    const deleted = await deleteEvent(id);
    if (!deleted) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Event deleted" });
}