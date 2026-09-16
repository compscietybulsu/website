import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { deleteCommitteeMember, getCommitteeMember, updateCommitteeMember } from "@/lib/db";

export const runtime = "edge";

const COMMITTEE_SLUGS = [
  "finance",
  "secretary",
  "membership",
  "development-core",
  "multimedia",
  "logistics",
  "events",
  "ethics",
];

export async function GET(_request, { params }) {
  const { id } = await params;
  const member = await getCommitteeMember(id);
  if (!member) {
    return NextResponse.json({ message: "Committee member not found" }, { status: 404 });
  }
  return NextResponse.json(member);
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

  const committeeSlug = typeof body.committeeSlug === "string" ? body.committeeSlug.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const photo = typeof body.photo === "string" ? body.photo.trim() : "";

  if (!committeeSlug || !COMMITTEE_SLUGS.includes(committeeSlug)) {
    return NextResponse.json({ message: "Valid committeeSlug is required" }, { status: 400 });
  }

  if (!name || !role) {
    return NextResponse.json({ message: "Name and role are required" }, { status: 400 });
  }

  const member = await updateCommitteeMember(id, {
    committeeSlug,
    name,
    role,
    photo,
  });

  if (!member) {
    return NextResponse.json({ message: "Committee member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { id } = await params;
  const deleted = await deleteCommitteeMember(id);
  if (!deleted) {
    return NextResponse.json({ message: "Committee member not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Committee member deleted" });
}
