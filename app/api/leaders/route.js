import { NextResponse } from "next/server";
import { listLeaders } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  const leaders = await listLeaders();
  return NextResponse.json(leaders);
}
