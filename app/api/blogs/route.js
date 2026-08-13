import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createBlog, listBlogs } from "@/lib/db";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export async function GET(request) {
  const url = new URL(request.url);
  const page = parsePositiveInt(url.searchParams.get("page"), DEFAULT_PAGE);
  const limit = Math.min(
    parsePositiveInt(url.searchParams.get("limit"), DEFAULT_LIMIT),
    MAX_LIMIT
  );
  const result = await listBlogs({ page, limit });
  return NextResponse.json(result);
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400 }
    );
  }

  const blog = await createBlog({
    title,
    content,
    image: typeof body.image === "string" ? body.image : "",
    fbLink: typeof body.fbLink === "string" ? body.fbLink : "",
  });
  return NextResponse.json(blog, { status: 201 });
}
