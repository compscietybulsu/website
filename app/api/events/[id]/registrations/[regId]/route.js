import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deleteRegistration } from "@/lib/registrations";

export async function DELETE(request, { params }) {
    const admin = await requireAdmin(request);
    if (isAuthError(admin)) return admin;

    const { id, regId } = await params;
    const deleted = await deleteRegistration(id, regId);
    if (!deleted) return NextResponse.json({ message: "Registration not found" }, { status: 404 });
    return NextResponse.json({ message: "Registration removed" });
}
