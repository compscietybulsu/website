import { NextResponse } from "next/server";
import { getMediaBucket } from "@/lib/cf";

export async function GET(_request, { params }) {
  const { key: parts } = await params;
  const key = Array.isArray(parts) ? parts.join("/") : parts;
  if (!key || key.includes("..")) {
    return NextResponse.json({ message: "Invalid media key" }, { status: 400 });
  }

  const bucket = await getMediaBucket();
  const object = await bucket.get(key);
  if (!object) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType || "application/octet-stream"
  );
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  if (object.httpEtag) {
    headers.set("ETag", object.httpEtag);
  }

  return new NextResponse(object.body, { headers });
}
