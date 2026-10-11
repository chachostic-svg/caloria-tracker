import { OAuth2Client } from "google-auth-library";
import { getGoogleClientId as resolveClientId } from "@/lib/googleConfig";

export function getGoogleClientId() {
  return resolveClientId();
}

export async function verifyGoogleCredential(credential) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID не настроен");
  }
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new Error("Неполные данные от Google");
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    emailVerified: payload.email_verified === true,
  };
}
