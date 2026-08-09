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
  // or expired (tokens now last 24h instead of 7d — see SPEC.md). Clear it
  // and bounce back to login instead of leaving the admin looking at a
  // silent inline error.
  if (res.status === 401 && typeof window !== "undefined") {
    clearToken();
    if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin") {
      window.location.href = "/admin";
    }
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