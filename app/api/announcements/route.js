import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyAdminToken } from "@/lib/apiAuth";

// D1 + JWT need the Workers runtime, not the Node runtime.
export const runtime = "edge";

/**
 * GET /api/announcements — public, no auth.
 * Returns all announcements, newest first (same shape as GET /api/blogs).
 */
export async function GET() {
  const { env } = getCloudflareContext();

  const { results } = await env.DB.prepare(
    `SELECT id, title, content, image, link, created_at, updated_at
     FROM announcements
     ORDER BY created_at DESC`
  ).all();

  return NextResponse.json(results.map(toAnnouncementJSON));
}

/**
 * POST /api/announcements — Bearer JWT required.
 * Body: { title, content?, image?, link? } -> 201 Announcement
 */
export async function POST(request) {
  const auth = await verifyAdminToken(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }

  const { env } = getCloudflareContext();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const content = typeof body.content === "string" ? body.content : "";
  const image = typeof body.image === "string" ? body.image : "";
  const link = typeof body.link === "string" ? body.link : "";

  await env.DB.prepare(
    `INSERT INTO announcements (id, title, content, image, link, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, title, content, image, link, now, now)
    .run();

  return NextResponse.json(
    toAnnouncementJSON({
      id,
      title,
      content,
      image,
      link,
      created_at: now,
      updated_at: now,
    }),
    { status: 201 }
  );
}

function toAnnouncementJSON(row) {
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    image: row.image,
    link: row.link,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}