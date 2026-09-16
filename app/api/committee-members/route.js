import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createCommitteeMember, listCommitteeMembers } from "@/lib/db";

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

export async function GET() {
  const members = await listCommitteeMembers();
  return NextResponse.json(members);
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

  const member = await createCommitteeMember({
    committeeSlug,
    name,
    role,
    photo,
  });

  return NextResponse.json(member, { status: 201 });
}
