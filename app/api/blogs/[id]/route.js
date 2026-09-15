import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deleteBlog, getBlog, updateBlog } from "@/lib/db";
import { isValidHttpUrl, isValidImageUrl } from "@/lib/validation";

export async function GET(_request, { params }) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { id } = await params;
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

  const blog = await updateBlog(id, {
    title,
    content,
    image,
    fbLink,
  });
  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json(blog);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { id } = await params;
  const deleted = await deleteBlog(id);
  if (!deleted) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Blog deleted" });
}
