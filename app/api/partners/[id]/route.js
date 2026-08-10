import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deletePartner, getPartner, updatePartner } from "@/lib/db";

export async function GET(_request, { params }) {
  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) {
    return NextResponse.json({ message: "Partner not found" }, { status: 404 });
  }
  return NextResponse.json(partner);
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const partner = await updatePartner(id, {
    name,
    detail: typeof body.detail === "string" ? body.detail : "",
    image: typeof body.image === "string" ? body.image : "",
  });
  if (!partner) {
    return NextResponse.json({ message: "Partner not found" }, { status: 404 });
  }
  return NextResponse.json(partner);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { id } = await params;
  const deleted = await deletePartner(id);
  if (!deleted) {
    return NextResponse.json({ message: "Partner not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Partner deleted" });
}
