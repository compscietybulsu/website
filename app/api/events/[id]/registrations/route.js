import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { getEvent } from "@/lib/events";
import { buildConfirmationEmail, sendMail } from "@/lib/mailer";
import {
    countGoing, createRegistration, isValidEmail, listRegistrations, markEmailSent, maskName,
} from "@/lib/registrations";

const MAX_PUBLIC_NAMES = 50;

// GET — public: count + masked names (no emails). With an admin Bearer token: full list.
export async function GET(request, { params }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    if (request.headers.get("authorization")) {
        const admin = await requireAdmin(request);
        if (isAuthError(admin)) return admin;
        const registrations = await listRegistrations(id);
        return NextResponse.json({ goingCount: registrations.length, registrations });
    }

    if (!event.registrationEnabled) {
        return NextResponse.json({ registrationEnabled: false, goingCount: 0, going: [] });
    }
    const registrations = await listRegistrations(id);
    return NextResponse.json({
        registrationEnabled: true,
        goingCount: registrations.length,
        going: registrations.slice(0, MAX_PUBLIC_NAMES).map((r) => maskName(r.name)),
    });
}

// POST — public: register as "Going".
export async function POST(request, { params }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
    if (!event.registrationEnabled) {
        return NextResponse.json({ message: "Registration is not open for this event" }, { status: 403 });
    }
    if (event.status === "done") {
        return NextResponse.json({ message: "This event has already ended" }, { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    // Honeypot: bots fill the hidden "website" field. Pretend success.
    if (typeof body.website === "string" && body.website) {
        return NextResponse.json({ message: "Registered" }, { status: 201 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const studentNumber = typeof body.studentNumber === "string" ? body.studentNumber.trim() : "";

    if (name.length < 2 || name.length > 100) {
        return NextResponse.json({ message: "Please enter your full name" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
    }
    if (studentNumber.length > 30) {
        return NextResponse.json({ message: "Student number is too long" }, { status: 400 });
    }

    const result = await createRegistration(id, { name, email, studentNumber });
    if (result.duplicate) {
        return NextResponse.json({ message: "This email is already registered for the event" }, { status: 409 });
    }
    const { registration } = result;

    // Email in the background; a mail failure must not undo the registration.
    const task = (async () => {
        try {
            await sendMail({ to: email, ...buildConfirmationEmail(event, registration) });
            await markEmailSent(registration._id);
        } catch (err) {
            console.error("RSVP confirmation email failed:", err?.message || err);
        }
    })();
    try {
        const { ctx } = await getCloudflareContext({ async: true });
        ctx.waitUntil(task);
    } catch {
        await task;
    }

    return NextResponse.json(
        { message: "You're registered! Check your email for confirmation.", goingCount: await countGoing(id) },
        { status: 201 }
    );
}
