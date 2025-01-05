import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/auth-cookies";

export async function GET() {
  try {
    await destroySession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
