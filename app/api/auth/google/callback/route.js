import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";
import { createSession } from "@/lib/auth";
import { upsertUserFromGoogle } from "@/lib/db";
import { getGoogleClientId, getGoogleClientSecret } from "@/lib/googleConfig";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=oauth_state", request.url));
  }

  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const redirectUri = `${url.origin}/api/auth/google/callback`;

  try {
    const client = new OAuth2Client(clientId, clientSecret, redirectUri);
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new Error("Invalid payload");
    }
    if (payload.email_verified === false) {
      return NextResponse.redirect(new URL("/login?error=email_not_verified", request.url));
    }

    const user = upsertUserFromGoogle({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
    });
    await createSession(user.id);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    const msg = err?.message || String(err);
    console.error("Google callback error:", msg);
    const code = msg.includes("redirect_uri") ? "redirect_uri" : "google_failed";
    return NextResponse.redirect(new URL(`/login?error=${code}`, request.url));
  }
}
