import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createAnnouncement, listAnnouncements } from "@/lib/db";

export async function GET() {
  const announcements = await listAnnouncements();
  return NextResponse.json(announcements);
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

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400 }
    );
  }

  const announcement = await createAnnouncement({
    title,
    content,
    image: typeof body.image === "string" ? body.image : "",
  });
  return NextResponse.json(announcement, { status: 201 });
}
