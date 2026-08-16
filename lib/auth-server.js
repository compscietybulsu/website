import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "./cf";

async function jwtSecretKey() {
  const env = await getEnv();
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set (use wrangler secret / .dev.vars)");
  }
  return new TextEncoder().encode(secret);
}

/**
 * @param {{ id: string, username: string }} admin
 * @returns {Promise<string>}
 */
export async function signAdminToken(admin) {
  const key = await jwtSecretKey();
  return new SignJWT({ id: admin.id, username: admin.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * @param {Request} request
 * @returns {Promise<{ id: string, username: string } | Response>}
 */
export async function requireAdmin(request) {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return Response.json({ message: "No token provided" }, { status: 401 });
  }
  const token = header.slice("Bearer ".length);
  try {
    const key = await jwtSecretKey();
    const { payload } = await jwtVerify(token, key);
    if (typeof payload.id !== "string" || typeof payload.username !== "string") {
      return Response.json({ message: "Invalid or expired token" }, { status: 401 });
    }
    return { id: payload.id, username: payload.username };
  } catch (err) {
    console.error("requireAdmin verification failed:", err);
    return Response.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

/** @param {{ id: string, username: string } | Response} result */
export function isAuthError(result) {
  return result instanceof Response;
}
