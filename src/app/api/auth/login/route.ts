import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth/auth-cookies";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    await createSessionCookie(idToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
