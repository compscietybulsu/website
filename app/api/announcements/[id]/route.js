import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyAdminToken } from "@/lib/apiAuth";

export const runtime = "edge";

/**
 * GET /api/announcements/:id — public, no auth. 404 if not found.
 */
export async function GET(request, { params }) {
  const { id } = await params;
  const { env } = getCloudflareContext();

  const row = await env.DB.prepare(
    `SELECT id, title, content, image, link, created_at, updated_at
     FROM announcements WHERE id = ?`
  )
    .bind(id)
    .first();

  if (!row) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(toAnnouncementJSON(row));
}

/**
 * PUT /api/announcements/:id — Bearer JWT required.
 * Body: { title, content?, image?, link? } -> 200 Announcement, 404 if missing.
 */
export async function PUT(request, { params }) {
  const auth = await verifyAdminToken(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const { id } = await params;
  const { env } = getCloudflareContext();

  const existing = await env.DB.prepare(`SELECT id FROM announcements WHERE id = ?`)
    .bind(id)
    .first();
  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const content = typeof body.content === "string" ? body.content : "";
  const image = typeof body.image === "string" ? body.image : "";
  const link = typeof body.link === "string" ? body.link : "";

  await env.DB.prepare(
    `UPDATE announcements
     SET title = ?, content = ?, image = ?, link = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(title, content, image, link, now, id)
    .run();

  const row = await env.DB.prepare(
    `SELECT id, title, content, image, link, created_at, updated_at
     FROM announcements WHERE id = ?`
  )
    .bind(id)
    .first();

  return NextResponse.json(toAnnouncementJSON(row));
}

/**
 * DELETE /api/announcements/:id — Bearer JWT required.
 * -> 200 { message }, 404 if missing.
 */
export async function DELETE(request, { params }) {
  const auth = await verifyAdminToken(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const { id } = await params;
  const { env } = getCloudflareContext();

  const existing = await env.DB.prepare(`SELECT id FROM announcements WHERE id = ?`)
    .bind(id)
    .first();
  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await env.DB.prepare(`DELETE FROM announcements WHERE id = ?`).bind(id).run();

  return NextResponse.json({ message: "Announcement deleted" });
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