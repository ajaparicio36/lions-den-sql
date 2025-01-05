import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth/auth-cookies";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    console.log("token", idToken);

    await createSessionCookie(idToken);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
