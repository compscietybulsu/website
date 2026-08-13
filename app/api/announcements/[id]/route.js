import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deleteAnnouncement, getAnnouncement, updateAnnouncement } from "@/lib/db";

export async function GET(_request, { params }) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);
  if (!announcement) {
    return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
  }
  return NextResponse.json(announcement);
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

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400 }
    );
  }

  const announcement = await updateAnnouncement(id, {
    title,
    content,
    image: typeof body.image === "string" ? body.image : "",
  });
  if (!announcement) {
    return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
  }
  return NextResponse.json(announcement);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { id } = await params;
  const deleted = await deleteAnnouncement(id);
  if (!deleted) {
    return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Announcement deleted" });
}
