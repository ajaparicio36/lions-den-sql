import { cookies } from "next/headers";
import { adminAuth } from "../firebase/firebaseAdminConfig";
import { redirect } from "next/navigation";
import { handleFirebaseError } from "./firebaseErrors";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRE_TIME = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRE_TIME,
    });

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRE_TIME / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    const { message } = handleFirebaseError(error);
    destroySession();
    redirect(`/error?message=${encodeURIComponent(message)}`);
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session.value);
    return decodedClaims;
  } catch (error) {
    const { message } = handleFirebaseError(error);
    destroySession();
    redirect(`/error?message=${encodeURIComponent(message)}`);
  }
}

export async function validateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) {
    redirect("/login");
  }

  try {
    await adminAuth.verifySessionCookie(session.value);
  } catch (error) {
    console.error(error);
    destroySession();
    redirect("/login");
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    const { message } = handleFirebaseError(error);
    destroySession();
    redirect(`/error?message=${encodeURIComponent(message)}`);
  }
}
