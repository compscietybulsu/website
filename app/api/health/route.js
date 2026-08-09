import { NextResponse } from "next/server";
import { getDB } from "@/lib/cf";

export async function GET() {
  try {
    const db = await getDB();
    await db.prepare("SELECT 1 AS ok").first();
    return NextResponse.json({ ok: true, storage: "d1" });
  } catch {
    return NextResponse.json(
      { ok: false, message: "unhealthy" },
      { status: 503 }
    );
  }
}
