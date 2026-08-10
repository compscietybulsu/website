import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth-server";
import { findAdminByUsername } from "@/lib/db";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }
  if (bcrypt.truncates(password)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const admin = await findAdminByUsername(username);
  if (!admin) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken({ id: admin.id, username: admin.username });
  return NextResponse.json({ token, username: admin.username });
}
