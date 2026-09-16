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

/** @param {Record<string, unknown>} row */
export function mapLeader(row) {
  if (!row) return null;
  return {
    _id: row.key,
    key: row.key,
    name: row.name,
    photo: row.photo ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** @param {Record<string, unknown>} row */
export function mapCommitteeMember(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    committeeSlug: row.committee_slug,
    name: row.name,
    role: row.role,
    photo: row.photo ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Lists blogs with optional pagination.
 * If page and limit are not provided, returns all blogs as an array.
 * If page or limit are provided, returns { items, total, page, limit, totalPages }.
 *
 * @param {{ page?: number, limit?: number }} [opts]
 */
export async function listBlogs({ page, limit } = {}) {
  const db = await getDB();
  if (!page && !limit) {
    const { results } = await db
      .prepare("SELECT * FROM blogs ORDER BY created_at DESC")
      .all();
    return (results ?? []).map(mapBlog);
  }

  const p = Math.max(1, page || 1);
  const l = Math.max(1, Math.min(limit || 10, 100));
  const totalRow = await db.prepare("SELECT COUNT(*) AS total FROM blogs").first();
  const total = Number(totalRow?.total ?? 0);
  const offset = (p - 1) * l;
  const { results } = await db
    .prepare("SELECT * FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .bind(l, offset)
    .all();
  const items = (results ?? []).map(mapBlog);
  return {
    items,
    total,
    page: p,
    limit: l,
    totalPages: Math.max(1, Math.ceil(total / l)),
  };
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

export async function listLeaders() {
  const db = await getDB();
  const { results } = await db.prepare("SELECT * FROM leaders").all();
  return (results ?? []).map(mapLeader);
}

export async function getLeader(key) {
  const db = await getDB();
  const row = await db.prepare("SELECT * FROM leaders WHERE key = ?").bind(key).first();
  return mapLeader(row);
}

export async function upsertLeader(key, { name, photo = "" }) {
  const db = await getDB();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO leaders (key, name, photo, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         name = excluded.name,
         photo = excluded.photo,
         updated_at = excluded.updated_at`
    )
    .bind(key, name, photo ?? "", now, now)
    .run();
  return getLeader(key);
}

export async function listCommitteeMembers() {
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM committee_members ORDER BY committee_slug ASC, created_at ASC")
    .all();
  return (results ?? []).map(mapCommitteeMember);
}

export async function getCommitteeMember(id) {
  const db = await getDB();
  const row = await db.prepare("SELECT * FROM committee_members WHERE id = ?").bind(id).first();
  return mapCommitteeMember(row);
}

export async function createCommitteeMember({ committeeSlug, name, role, photo = "" }) {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO committee_members (id, committee_slug, name, role, photo)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, committeeSlug, name, role, photo ?? "")
    .run();
  return getCommitteeMember(id);
}

export async function updateCommitteeMember(id, { committeeSlug, name, role, photo = "" }) {
  const db = await getDB();
  const result = await db
    .prepare(
      `UPDATE committee_members
       SET committee_slug = ?, name = ?, role = ?, photo = ?,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`
    )
    .bind(committeeSlug, name, role, photo ?? "", id)
    .run();
  if (!result.meta?.changes) return null;
  return getCommitteeMember(id);
}

export async function deleteCommitteeMember(id) {
  const db = await getDB();
  const result = await db.prepare("DELETE FROM committee_members WHERE id = ?").bind(id).run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function findAdminByUsername(username) {
  const db = await getDB();
  return db
    .prepare("SELECT id, username, password_hash FROM admins WHERE username = ? COLLATE NOCASE")
    .bind(username)
    .first();
}
