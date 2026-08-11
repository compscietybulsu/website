import { getDB } from "./cf";

/** @param {Record<string, unknown>} row */
export function mapBlog(row) {
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    image: row.image ?? "",
    fbLink: row.fb_link ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** @param {Record<string, unknown>} row */
export function mapPartner(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    detail: row.detail ?? "",
    image: row.image ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listBlogs() {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM blogs ORDER BY created_at DESC")
    .all();
  return (results ?? []).map(mapBlog);
}

export async function getBlog(id) {
  const db = await getDB();
  const row = await db.prepare("SELECT * FROM blogs WHERE id = ?").bind(id).first();
  return mapBlog(row);
}

export async function createBlog({ title, content, image = "", fbLink = "" }) {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO blogs (id, title, content, image, fb_link)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, title, content, image ?? "", fbLink ?? "")
    .run();
  return getBlog(id);
}

export async function updateBlog(id, { title, content, image = "", fbLink = "" }) {
  const db = await getDB();
  const result = await db
    .prepare(
      `UPDATE blogs
       SET title = ?, content = ?, image = ?, fb_link = ?,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`
    )
    .bind(title, content, image ?? "", fbLink ?? "", id)
    .run();
  if (!result.meta?.changes) return null;
  return getBlog(id);
}

export async function deleteBlog(id) {
  const db = await getDB();
  const result = await db.prepare("DELETE FROM blogs WHERE id = ?").bind(id).run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function listPartners() {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM partners ORDER BY created_at DESC")
    .all();
  return (results ?? []).map(mapPartner);
}

export async function getPartner(id) {
  const db = await getDB();
  const row = await db.prepare("SELECT * FROM partners WHERE id = ?").bind(id).first();
  return mapPartner(row);
}

export async function createPartner({ name, detail = "", image = "" }) {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO partners (id, name, detail, image)
       VALUES (?, ?, ?, ?)`
    )
    .bind(id, name, detail ?? "", image ?? "")
    .run();
  return getPartner(id);
}

export async function updatePartner(id, { name, detail = "", image = "" }) {
  const db = await getDB();
  const result = await db
    .prepare(
      `UPDATE partners
       SET name = ?, detail = ?, image = ?,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`
    )
    .bind(name, detail ?? "", image ?? "", id)
    .run();
  if (!result.meta?.changes) return null;
  return getPartner(id);
}

export async function deletePartner(id) {
  const db = await getDB();
  const result = await db.prepare("DELETE FROM partners WHERE id = ?").bind(id).run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function findAdminByUsername(username) {
  const db = await getDB();
  return db
    .prepare("SELECT id, username, password_hash FROM admins WHERE username = ? COLLATE NOCASE")
    .bind(username)
    .first();
}
