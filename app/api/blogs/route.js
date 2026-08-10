import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createBlog, listBlogs } from "@/lib/db";

export async function GET() {
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
