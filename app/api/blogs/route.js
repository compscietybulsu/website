import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createBlog, listBlogs } from "@/lib/db";
import { isValidHttpUrl, isValidImageUrl } from "@/lib/validation";

export async function GET(request) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const limitParam = url.searchParams.get("limit");

  if (pageParam !== null || limitParam !== null) {
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
    const limit = limitParam ? Math.max(1, Math.min(parseInt(limitParam, 10) || 10, 100)) : 10;
    const result = await listBlogs({ page, limit });
    return NextResponse.json(result);
  }

  const blogs = await listBlogs();
  return NextResponse.json(blogs);
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
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const fbLink = typeof body.fbLink === "string" ? body.fbLink.trim() : "";

  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400 }
    );
  }

  if (title.length > 200) {
    return NextResponse.json(
      { message: "Title must not exceed 200 characters" },
      { status: 400 }
    );
  }

  if (image && !isValidImageUrl(image)) {
    return NextResponse.json(
      { message: "Invalid image URL format" },
      { status: 400 }
    );
  }

  if (fbLink && !isValidHttpUrl(fbLink)) {
    return NextResponse.json(
      { message: "Invalid fbLink URL format (must start with http:// or https://)" },
      { status: 400 }
    );
  }

  const blog = await createBlog({
    title,
    content,
    image,
    fbLink,
  });
  return NextResponse.json(blog, { status: 201 });
}
