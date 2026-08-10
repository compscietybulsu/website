/**
 * Upload an image to the Worker (R2 via POST /api/uploads).
 * Returns a same-origin URL served by GET /api/media/...
 */
export async function uploadImage(file, token) {
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "uploads");

  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Image upload failed");
  }
  return data.url;
}
