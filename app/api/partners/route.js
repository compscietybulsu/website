import { NextResponse } from "next/server";
import { isAuthError, requireAdmin } from "@/lib/auth-server";
import { createPartner, listPartners } from "@/lib/db";

export async function GET() {
  const partners = await listPartners();
  return NextResponse.json(partners);
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const partner = await createPartner({
    name,
    detail: typeof body.detail === "string" ? body.detail : "",
    image: typeof body.image === "string" ? body.image : "",
  });
  return NextResponse.json(partner, { status: 201 });
}
