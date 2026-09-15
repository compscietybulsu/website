import { jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Verifies the `Authorization: Bearer <token>` header the same way the Blog
 * admin routes do per SPEC.md §3.2/§3.3: HS256, secret JWT_SECRET, payload
 * `{ id, username }`.
 *
 * NOTE: if `app/api/blogs` already has a shared auth-verification helper,
 * prefer importing that one from the announcements routes instead of this
 * file, and delete this duplicate. This was written standalone because the
 * existing blogs route implementation wasn't available to mirror directly —
 * only README.md/SPEC.md/tasks.md and the top-level config files were in the
 * project mount, not `app/`, `lib/`, or `migrations/`.
 *
 * @param {Request} request
 * @returns {Promise<{ ok: true, payload: import("jose").JWTPayload } | { ok: false, status: number, message: string }>}
 */
export async function verifyAdminToken(request) {
  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return { ok: false, status: 401, message: "Missing or invalid Authorization header" };
  }

  const { env } = getCloudflareContext();
  const secret = env.JWT_SECRET;
  if (!secret) {
    return { ok: false, status: 500, message: "Server misconfigured: JWT_SECRET not set" };
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return { ok: true, payload };
  } catch {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }
}