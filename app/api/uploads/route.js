import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { getMediaBucket } from "@/lib/cf";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFor(type) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "file is required" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { message: "Only JPEG, PNG, WebP, or GIF images are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Image must be 8MB or smaller" }, { status: 400 });
  }

  const folderRaw = form.get("folder");
  const folder =
    typeof folderRaw === "string" && /^[a-z0-9_-]+$/i.test(folderRaw)
      ? folderRaw
      : "uploads";

  const key = `${folder}/${crypto.randomUUID()}.${extFor(file.type)}`;
  const bucket = await getMediaBucket();
  const bytes = await file.arrayBuffer();
  await bucket.put(key, bytes, {
    httpMetadata: { contentType: file.type },
  });

  // Served by this Worker (same origin) — no R2 public bucket required.
  const url = `/api/media/${key}`;
  return NextResponse.json({ url, key }, { status: 201 });
}
