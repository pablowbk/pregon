import { NextResponse } from "next/server";
import { deleteAuthSession } from "@/lib/auth";

export async function POST() {
  await deleteAuthSession();
  return NextResponse.json({ success: true });
}

