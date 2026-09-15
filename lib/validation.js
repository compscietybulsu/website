/**
 * Validates whether a string is a valid HTTP/HTTPS URL (or empty/omitted).
 *
 * @param {unknown} string
 * @returns {boolean}
 */
export function isValidHttpUrl(string) {
  if (!string || typeof string !== "string") return true;
  const trimmed = string.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates image URL: allows http(s) URLs, root-relative paths, and data URIs.
 *
 * @param {unknown} string
 * @returns {boolean}
 */
export function isValidImageUrl(string) {
  if (!string || typeof string !== "string") return true;
  const trimmed = string.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/") || trimmed.startsWith("data:image/")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
