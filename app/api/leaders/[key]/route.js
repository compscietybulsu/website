import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { getLeader, upsertLeader } from "@/lib/db";

export const runtime = "edge";

const LEADER_KEYS = [
  "president",
  "chief-of-staff",
  "internal-vp",
  "external-vp",
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
  const { key } = await params;
  if (!LEADER_KEYS.includes(key)) {
    return NextResponse.json({ message: "Invalid leader key" }, { status: 400 });
  }

  const leader = await getLeader(key);
  return NextResponse.json(leader || { _id: key, key, name: "", photo: "" });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin(request);
  if (isAuthError(admin)) return admin;

  const { key } = await params;
  if (!LEADER_KEYS.includes(key)) {
    return NextResponse.json({ message: "Invalid leader key" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const photo = typeof body.photo === "string" ? body.photo.trim() : "";

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const leader = await upsertLeader(key, { name, photo });
  return NextResponse.json(leader);
}
