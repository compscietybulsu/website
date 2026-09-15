import { decodeJwt } from "jose";

const TOKEN_KEY = "compsciety_admin_token";

export function saveToken(token) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = decodeJwt(token);
    return typeof exp !== "number" || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function getValidToken() {
  const token = getToken();
  if (isTokenExpired(token)) {
    clearToken();
    return null;
  }
  return token;
}