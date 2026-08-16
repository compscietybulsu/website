import { clearToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // A 401 on an authenticated request means the token is missing, invalid,
  // or expired. Previously this did a hard `window.location.href` reload,
  // which can collide with React's in-flight rendering (e.g. mid-upload,
  // mid form-submit) and throw confusing hydration errors that have
  // nothing to do with the actual page. Dispatching an event instead lets
  // AdminGuard handle the redirect through Next.js's own router — a soft,
  // client-side transition with no full-page reload, no race.
  if (res.status === 401 && typeof window !== "undefined") {
    clearToken();
    window.dispatchEvent(new Event("compsciety:auth-expired"));
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};